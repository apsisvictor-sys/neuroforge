import { NextResponse } from "next/server";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";

export async function GET() {
  const auth = await requireUserId();
  if ("response" in auth) return auth.response;

  const user = await repositories.user.getById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const base = { tier: user.subscriptionTier, trialEnd: null as string | null, daysRemaining: null as number | null };

  if (!user.stripeCustomerId) {
    return NextResponse.json(base);
  }

  try {
    const stripe = getStripeClient();
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "trialing",
      limit: 1,
    });

    const sub = subscriptions.data[0];
    if (!sub?.trial_end) {
      return NextResponse.json(base);
    }

    const trialEnd = new Date(sub.trial_end * 1000).toISOString();
    const daysRemaining = Math.max(
      0,
      Math.ceil((sub.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
    );

    return NextResponse.json({ tier: user.subscriptionTier, trialEnd, daysRemaining });
  } catch (error) {
    logger.error("Failed to fetch subscription status", { error });
    return NextResponse.json(base);
  }
}
