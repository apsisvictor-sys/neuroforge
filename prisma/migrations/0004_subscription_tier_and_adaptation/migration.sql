-- Add SubscriptionTier enum and related User fields (from PIX-44 Stripe integration)
-- Add AdaptationProposal table (from PIX-22 adaptation feature)

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'premium', 'professional');

-- AlterTable: add subscriptionTier and stripeCustomerId to User
ALTER TABLE "User"
  ADD COLUMN "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'free',
  ADD COLUMN "stripeCustomerId" TEXT;

-- CreateIndex: unique stripeCustomerId
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateTable: AdaptationProposal
CREATE TABLE "AdaptationProposal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "proposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "AdaptationProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdaptationProposal_userId_status_idx" ON "AdaptationProposal"("userId", "status");

-- AddForeignKey
ALTER TABLE "AdaptationProposal" ADD CONSTRAINT "AdaptationProposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex: Checkin descending sort index
CREATE INDEX "Checkin_userId_dayKey_desc_idx" ON "Checkin"("userId", "dayKey" DESC);

-- CreateIndex: Enrollment active index
CREATE INDEX "Enrollment_userId_active_idx" ON "Enrollment"("userId", "active");

-- CreateIndex: Message conversation index
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
