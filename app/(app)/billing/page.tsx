import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { repositories } from "@/infrastructure/db/repositories";
import { getStripeClient } from "@/infrastructure/stripe/stripe-client";
import { logger } from "@/infrastructure/logging/logger";
import { BillingClient } from "./billing-client";

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
    logger.error("Failed to fetch trial info", { error });
    return null;
  }
}

export default async function BillingPage() {
  const userId = await requireUserPage();
  const user = await repositories.user.getById(userId);

  const tier = (user?.subscriptionTier ?? "free") as "free" | "premium" | "professional";
  const daysRemaining = user?.stripeCustomerId
    ? await getTrialDaysRemaining(user.stripeCustomerId)
    : null;

  return <BillingClient tier={tier} daysRemaining={daysRemaining} />;
}
