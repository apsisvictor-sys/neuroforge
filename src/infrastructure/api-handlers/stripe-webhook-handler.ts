import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";
import { getRedisConnection } from "@/infrastructure/jobs/redis-job-queue";

const WEBHOOK_IDEMPOTENCY_TTL_SECONDS = 86_400; // 24 hours
const WEBHOOK_EVENT_ORDER_TTL_SECONDS = 604_800; // 7 days

async function acquireWebhookIdempotencyKey(key: string): Promise<boolean> {
  try {
    const redis = getRedisConnection();
    const result = await redis.set(key, "1", "EX", WEBHOOK_IDEMPOTENCY_TTL_SECONDS, "NX");
    return result === "OK";
  } catch (err) {
    // If Redis is unavailable, allow processing (safe degradation)
    logger.warn("Redis unavailable for webhook idempotency check, proceeding", { key, err });
    return true;
  }
}

async function checkAndUpdateEventOrder(customerId: string, eventCreated: number): Promise<boolean> {
  try {
    const redis = getRedisConnection();
    const key = `stripe:webhook:last_event_ts:${customerId}`;
    const lastTs = await redis.get(key);
    if (lastTs !== null && typeof eventCreated === "number" && eventCreated < parseInt(lastTs, 10)) {
      return false; // stale out-of-order event
    }
    await redis.set(key, String(eventCreated), "EX", WEBHOOK_EVENT_ORDER_TTL_SECONDS);
    return true;
  } catch (err) {
    logger.warn("Redis unavailable for event ordering check, proceeding", { customerId, err });
    return true;
  }
}

type Tier = "free" | "premium" | "professional";

function tierFromStripePrice(priceId: string): Tier {
  const premiumMonthly = process.env.STRIPE_PRICE_PREMIUM_MONTHLY;
  const premiumAnnual = process.env.STRIPE_PRICE_PREMIUM_ANNUAL;
  const proMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (priceId === premiumMonthly || priceId === premiumAnnual) return "premium";
  if (priceId === proMonthly) return "professional";
  return "free";
}

export type StripeWebhookRouteDeps = {
  userRepository: {
    updateSubscription: (userId: string, tier: Tier, stripeCustomerId?: string) => Promise<void>;
    getByStripeCustomerId: (stripeCustomerId: string) => Promise<{ id: string } | null>;
  };
  getStripeClient: typeof getStripeClient;
  acquireIdempotencyKey?: (eventId: string) => Promise<boolean>;
  checkEventOrder?: (customerId: string, eventCreated: number) => Promise<boolean>;
};

export const defaultStripeWebhookRouteDeps: StripeWebhookRouteDeps = {
  userRepository: repositories.user,
  getStripeClient,
  acquireIdempotencyKey: (eventId: string) =>
    acquireWebhookIdempotencyKey(`stripe:webhook:event:${eventId}`),
  checkEventOrder: checkAndUpdateEventOrder
};

export async function handleStripeWebhookPost(
  request: NextRequest,
  deps: StripeWebhookRouteDeps = defaultStripeWebhookRouteDeps
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("Stripe webhook secret not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = deps.getStripeClient();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    logger.error("Stripe webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const doAcquireIdempotencyKey =
    deps.acquireIdempotencyKey ??
    ((eventId: string) => acquireWebhookIdempotencyKey(`stripe:webhook:event:${eventId}`));
  const doCheckEventOrder = deps.checkEventOrder ?? checkAndUpdateEventOrder;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const acquired = await doAcquireIdempotencyKey(event.id);
        if (!acquired) {
          logger.info("Stripe webhook already processed, skipping", { eventId: event.id });
          break;
        }

        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        if (!customerId || !subscriptionId) break;

        const ordered = await doCheckEventOrder(customerId, event.created);
        if (!ordered) {
          logger.info("Stripe webhook stale event, skipping", { eventId: event.id, customerId });
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? "";
        const tier = tierFromStripePrice(priceId);

        const metaUserId = session.metadata?.userId;
        if (metaUserId) {
          await deps.userRepository.updateSubscription(metaUserId, tier, customerId);
          logger.info("Subscription activated", { userId: metaUserId, tier });
        }
        break;
      }

      case "customer.subscription.updated": {
        const acquired = await doAcquireIdempotencyKey(event.id);
        if (!acquired) {
          logger.info("Stripe webhook already processed, skipping", { eventId: event.id });
          break;
        }

        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const ordered = await doCheckEventOrder(customerId, event.created);
        if (!ordered) {
          logger.info("Stripe webhook stale event, skipping", { eventId: event.id, customerId });
          break;
        }

        const priceId = subscription.items.data[0]?.price.id ?? "";
        const tier = tierFromStripePrice(priceId);
        const status = subscription.status;

        const user = await deps.userRepository.getByStripeCustomerId(customerId);
        if (user) {
          const effectiveTier: Tier = status === "active" || status === "trialing" ? tier : "free";
          await deps.userRepository.updateSubscription(user.id, effectiveTier);
          logger.info("Subscription updated", { userId: user.id, tier: effectiveTier, status });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const acquired = await doAcquireIdempotencyKey(event.id);
        if (!acquired) {
          logger.info("Stripe webhook already processed, skipping", { eventId: event.id });
          break;
        }

        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const ordered = await doCheckEventOrder(customerId, event.created);
        if (!ordered) {
          logger.info("Stripe webhook stale event, skipping", { eventId: event.id, customerId });
          break;
        }

        const user = await deps.userRepository.getByStripeCustomerId(customerId);
        if (user) {
          await deps.userRepository.updateSubscription(user.id, "free");
          logger.info("Subscription cancelled - downgraded to free", { userId: user.id });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Stripe webhook processing error", { error });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
