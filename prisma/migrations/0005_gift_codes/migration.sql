-- FEAT-14-A: Add GiftCode model and GiftCodeStatus enum
-- Add premiumGiftExpiresAt to User for tracking gifted premium expiry

-- CreateEnum
CREATE TYPE "GiftCodeStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'REDEEMED', 'EXPIRED');

-- AlterTable: add gift fields to User
ALTER TABLE "User"
  ADD COLUMN "premiumGiftExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "GiftCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "GiftCodeStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "durationMonths" INTEGER NOT NULL,
    "purchaserEmail" TEXT,
    "purchaserId" TEXT,
    "recipientEmail" TEXT,
    "redeemedByUserId" TEXT,
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique code
CREATE UNIQUE INDEX "GiftCode_code_key" ON "GiftCode"("code");

-- CreateIndex: unique stripeSessionId
CREATE UNIQUE INDEX "GiftCode_stripeSessionId_key" ON "GiftCode"("stripeSessionId");

-- CreateIndex
CREATE INDEX "GiftCode_code_idx" ON "GiftCode"("code");

-- CreateIndex
CREATE INDEX "GiftCode_status_idx" ON "GiftCode"("status");

-- AddForeignKey
ALTER TABLE "GiftCode" ADD CONSTRAINT "GiftCode_purchaserId_fkey" FOREIGN KEY ("purchaserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCode" ADD CONSTRAINT "GiftCode_redeemedByUserId_fkey" FOREIGN KEY ("redeemedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
