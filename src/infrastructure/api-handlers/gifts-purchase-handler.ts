import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSessionUserId } from "@/infrastructure/auth/session";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient, STRIPE_PRICES, GIFT_PRICE_DURATION_MONTHS } from "@/infrastructure/stripe/stripe-client";
import { sendGiftPurchaseConfirmationEmail } from "@/infrastructure/email/gift-emails";
import { logger } from "@/infrastructure/logging/logger";

const VALID_GIFT_PRICE_IDS = new Set([
  STRIPE_PRICES.giftPremium1M,
  STRIPE_PRICES.giftPremium3M,
  STRIPE_PRICES.giftPremium6M,
  STRIPE_PRICES.giftPremium12M,
].filter(Boolean));

function generateGiftCode(): string {
  const bytes = randomBytes(8);
  const hex = bytes.toString("hex").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

export async function handleGiftsPurchasePost(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const priceId = String(body.priceId ?? "");
  const recipientEmail = body.recipientEmail ? String(body.recipientEmail) : undefined;

  if (!priceId || !VALID_GIFT_PRICE_IDS.has(priceId)) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }

  const durationMonths = GIFT_PRICE_DURATION_MONTHS[priceId];
  if (!durationMonths) {
    return NextResponse.json({ error: "Could not resolve gift duration" }, { status: 400 });
  }

  // Auth is optional — purchaser may or may not be logged in
  const userId = await getSessionUserId();
  let purchaserEmail: string | undefined;
  let purchaserId: string | undefined;

  if (userId) {
    const user = await repositories.user.getById(userId);
    purchaserEmail = user?.email;
    purchaserId = userId;
  } else if (body.email) {
    purchaserEmail = String(body.email);
  }

  const code = generateGiftCode();
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const stripe = getStripeClient();

    // Create Stripe Checkout session (mode: payment, not subscription)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(purchaserEmail ? { customer_email: purchaserEmail } : {}),
      metadata: {
        giftCode: code,
        durationMonths: String(durationMonths),
        ...(recipientEmail ? { recipientEmail } : {}),
        ...(purchaserId ? { purchaserId } : {}),
      },
      success_url: `${appUrl}/gift/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/gift`,
    });

    // Persist the GiftCode record with PENDING_PAYMENT status
    await repositories.gift.create({
      code,
      durationMonths,
      purchaserEmail,
      purchaserId,
      recipientEmail,
      stripeSessionId: session.id,
    });

    logger.info("Gift checkout session created", { code, priceId, durationMonths });
    return NextResponse.json({ checkoutUrl: session.url, code });
  } catch (error) {
    logger.error("Failed to create gift checkout session", { error });
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
