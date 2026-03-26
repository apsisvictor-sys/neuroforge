import { prisma } from "@/infrastructure/db/prisma-client";
import type { GiftCodeStatus } from "@prisma/client";

export type GiftCodeRecord = {
  id: string;
  code: string;
  status: GiftCodeStatus;
  durationMonths: number;
  purchaserEmail: string | null;
  purchaserId: string | null;
  recipientEmail: string | null;
  redeemedByUserId: string | null;
  stripeSessionId: string | null;
  expiresAt: Date | null;
  redeemedAt: Date | null;
  createdAt: Date;
};

export type CreateGiftCodeInput = {
  code: string;
  durationMonths: number;
  purchaserEmail?: string;
  purchaserId?: string;
  recipientEmail?: string;
  stripeSessionId?: string;
};

export class PrismaGiftRepository {
  async create(input: CreateGiftCodeInput): Promise<GiftCodeRecord> {
    return prisma.giftCode.create({
      data: {
        code: input.code,
        durationMonths: input.durationMonths,
        purchaserEmail: input.purchaserEmail ?? null,
        purchaserId: input.purchaserId ?? null,
        recipientEmail: input.recipientEmail ?? null,
        stripeSessionId: input.stripeSessionId ?? null,
      },
    });
  }

  async getByCode(code: string): Promise<GiftCodeRecord | null> {
    return prisma.giftCode.findUnique({ where: { code } });
  }

  async getByStripeSessionId(sessionId: string): Promise<GiftCodeRecord | null> {
    return prisma.giftCode.findUnique({ where: { stripeSessionId: sessionId } });
  }

  async markPaid(code: string, stripeSessionId?: string): Promise<void> {
    await prisma.giftCode.update({
      where: { code },
      data: {
        status: "PAID",
        ...(stripeSessionId ? { stripeSessionId } : {}),
      },
    });
  }

  async redeem(
    code: string,
    redeemedByUserId: string
  ): Promise<GiftCodeRecord> {
    return prisma.giftCode.update({
      where: { code },
      data: {
        status: "REDEEMED",
        redeemedByUserId,
        redeemedAt: new Date(),
      },
    });
  }

  async markExpired(code: string): Promise<void> {
    await prisma.giftCode.update({
      where: { code },
      data: { status: "EXPIRED" },
    });
  }

  async updateStripeSession(code: string, stripeSessionId: string): Promise<void> {
    await prisma.giftCode.update({
      where: { code },
      data: { stripeSessionId },
    });
  }
}
