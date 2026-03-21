import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { enqueueJob } from "@/infrastructure/jobs/enqueue-job";
import type { OnboardingEmailPayload } from "@/infrastructure/email/onboarding-emails";

const DAY = 24 * 60 * 60 * 1000;

export const POST = withApiLogging("/api/onboarding/commit", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const { primaryType, recommendedProtocol } = body as {
      primaryType?: string;
      recommendedProtocol?: string;
    };

    if (!primaryType || !recommendedProtocol) {
      return badRequest("primaryType and recommendedProtocol are required");
    }

    const user = await repositories.user.getById(auth.userId);
    if (!user) return badRequest("User not found");

    const payload: OnboardingEmailPayload = {
      email: user.email,
      primaryType,
      recommendedProtocol,
    };

    // Schedule the 5-email nurture sequence + 3 weeks of weekly follow-ups
    await enqueueJob("onboarding.email_day1",   payload,                        { delayMs: 0 });
    await enqueueJob("onboarding.email_day2",   payload,                        { delayMs: 2 * DAY });
    await enqueueJob("onboarding.email_day4",   payload,                        { delayMs: 4 * DAY });
    await enqueueJob("onboarding.email_day6",   payload,                        { delayMs: 6 * DAY });
    await enqueueJob("onboarding.email_day7",   payload,                        { delayMs: 7 * DAY });
    await enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 2 },  { delayMs: 14 * DAY });
    await enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 3 },  { delayMs: 21 * DAY });
    await enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 4 },  { delayMs: 28 * DAY });

    return ok({ scheduled: true });
  } catch (error) {
    return serverError(error);
  }
});
