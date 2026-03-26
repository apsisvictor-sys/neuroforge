import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { prisma } from "@/infrastructure/db/prisma-client";
import { sendGiftRedemptionEmail } from "@/infrastructure/email/gift-emails";
import { logger } from "@/infrastructure/logging/logger";

export async function handleGiftsRedeemPost(request: NextRequest): Promise<NextResponse> {
  // Auth required
  const auth = await requireUserId();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => ({}));
  const code = String(body.code ?? "").trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const giftCode = await repositories.gift.getByCode(code);

  if (!giftCode) {
    return NextResponse.json({ error: "Invalid gift code" }, { status: 404 });
  }

  if (giftCode.status === "EXPIRED" || (giftCode.expiresAt && giftCode.expiresAt < new Date())) {
    return NextResponse.json({ error: "Gift code has expired" }, { status: 410 });
  }

  if (giftCode.status === "REDEEMED") {
    return NextResponse.json({ error: "Gift code has already been redeemed" }, { status: 409 });
  }

  if (giftCode.status !== "PAID") {
    return NextResponse.json({ error: "Gift code payment is not yet confirmed" }, { status: 402 });
  }

  // Check if the user is already on a paid tier via a recurring subscription
  const user = await repositories.user.getById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.subscriptionTier === "premium" || user.subscriptionTier === "professional") {
    // User already has an active subscription — still allow redeem; extend gift expiry on top
    logger.info("User already premium, extending gift on top", { userId: auth.userId, code });
  }

  // Calculate new expiry: start from today or existing gift expiry (whichever is later)
  const now = new Date();
  const existingRow = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { premiumGiftExpiresAt: true },
  });
  const base = existingRow?.premiumGiftExpiresAt && existingRow.premiumGiftExpiresAt > now
    ? existingRow.premiumGiftExpiresAt
    : now;
  const premiumExpiresAt = new Date(base);
  premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + giftCode.durationMonths);

  // Atomically: mark code redeemed + upgrade user tier + set gift expiry
  await prisma.$transaction([
    prisma.giftCode.update({
      where: { code },
      data: { status: "REDEEMED", redeemedByUserId: auth.userId, redeemedAt: now },
    }),
    prisma.user.update({
      where: { id: auth.userId },
      data: { subscriptionTier: "premium", premiumGiftExpiresAt: premiumExpiresAt },
    }),
  ]);

  logger.info("Gift code redeemed", { code, userId: auth.userId, premiumExpiresAt });

  // Send confirmation email (non-blocking)
  const recipientEmail = giftCode.recipientEmail ?? user.email;
  sendGiftRedemptionEmail({
    recipientEmail,
    durationMonths: giftCode.durationMonths,
    premiumExpiresAt,
  }).catch((err) => logger.error("Failed to send gift redemption email", { err }));

  return NextResponse.json({
    message: "Gift code redeemed successfully",
    premiumExpiresAt: premiumExpiresAt.toISOString(),
    durationMonths: giftCode.durationMonths,
  });
}
