/**
 * TrialBannerWrapper — server component
 *
 * Fetches the current user's trial status and renders the TrialBanner
 * client component when the user is on an active trial.
 */

import { getSessionUserId } from "@/infrastructure/auth/session";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";
import { TrialBannerClient } from "./TrialBannerClient";

async function getTrialDaysRemaining(stripeCustomerId: string): Promise<number | null> {
  try {
    const stripe = getStripeClient();
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "trialing",
      limit: 1,
    });
    const trialEnd = subscriptions.data[0]?.trial_end;
    if (!trialEnd) return null;
    return Math.max(0, Math.ceil((trialEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
  } catch (error) {
    logger.error("TrialBannerWrapper: failed to fetch trial info", { error });
    return null;
  }
}

export async function TrialBannerWrapper() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await repositories.user.getById(userId);
  if (!user?.stripeCustomerId) return null;

  const daysRemaining = await getTrialDaysRemaining(user.stripeCustomerId);
  if (daysRemaining === null || daysRemaining <= 0) return null;

  return <TrialBannerClient daysRemaining={daysRemaining} />;
}
