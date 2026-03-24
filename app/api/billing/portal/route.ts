import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";

export async function POST(request: NextRequest) {
  const auth = await requireUserId();
  if ("response" in auth) return auth.response;

  const user = await repositories.user.getById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`
    });

    logger.info("Portal session created", { userId: user.id });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Failed to create portal session", { error });
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
