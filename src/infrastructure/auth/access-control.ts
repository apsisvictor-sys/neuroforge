import { AppError } from "@/infrastructure/errors/app-error";
import type { SubscriptionTier } from "@/domain/entities/user";
import type { UserRepository } from "@/domain/repositories/user-repository";

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1,
  professional: 2,
};

export const AI_COACH_MONTHLY_FREE_LIMIT = 5;

/**
 * Throws a 403 AppError if the user's subscription tier is below `minTier`.
 * Usage: await requireSubscriptionTier(userId, "premium", repo);
 */
export async function requireSubscriptionTier(
  userId: string,
  minTier: SubscriptionTier,
  userRepo: Pick<UserRepository, "getById">
): Promise<void> {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new AppError({ message: "User not found", code: "NOT_FOUND", httpStatus: 404, expose: true });
  }

  const userRank = TIER_RANK[user.subscriptionTier];
  const requiredRank = TIER_RANK[minTier];

  if (userRank < requiredRank) {
    throw new AppError({
      message: "This feature requires a higher subscription tier",
      code: "INSUFFICIENT_TIER",
      httpStatus: 403,
      expose: true,
    });
  }
}

/**
 * Returns true if user has at least the given tier.
 */
export function hasTier(userTier: SubscriptionTier, minTier: SubscriptionTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[minTier];
}
