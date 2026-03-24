import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient, STRIPE_PRICES } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";

const VALID_PRICE_IDS = new Set([
  STRIPE_PRICES.premiumMonthly,
  STRIPE_PRICES.premiumAnnual,
  STRIPE_PRICES.professionalMonthly
]);

export type CheckoutRouteDeps = {
  requireUserId: typeof requireUserId;
  userRepository: {
    getById: (userId: string) => Promise<{ id: string; email: string; stripeCustomerId?: string } | null>;
  };
  getStripeClient: typeof getStripeClient;
};

export const defaultCheckoutRouteDeps: CheckoutRouteDeps = {
  requireUserId,
  userRepository: repositories.user,
  getStripeClient
};

export async function handleBillingCheckoutPost(
  request: NextRequest,
  deps: CheckoutRouteDeps = defaultCheckoutRouteDeps
) {
  const auth = await deps.requireUserId();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => ({}));
  const priceId = String(body.priceId ?? "");

  if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }

  const user = await deps.userRepository.getById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const stripe = deps.getStripeClient();
    const isPremium =
      priceId === STRIPE_PRICES.premiumMonthly || priceId === STRIPE_PRICES.premiumAnnual;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: user.stripeCustomerId,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      metadata: { userId: user.id },
      subscription_data: isPremium ? { trial_period_days: 14 } : undefined,
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing`
    });

    logger.info("Checkout session created", { userId: user.id, priceId });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Failed to create checkout session", { error });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
