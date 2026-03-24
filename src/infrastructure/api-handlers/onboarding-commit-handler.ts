import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { badRequest, ok, serverError } from "@/lib/api";
import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { enqueueJob } from "@/infrastructure/jobs/enqueue-job";
import { logger } from "@/infrastructure/logging/logger";
import type { OnboardingEmailPayload } from "@/infrastructure/email/onboarding-emails";

const DAY = 24 * 60 * 60 * 1000;

const VALID_PRIMARY_TYPES = ["Overstimulated", "BurnedOut", "Anxious", "InRecovery"] as const;

export type OnboardingCommitDeps = {
  requireUserId: typeof requireUserId;
  userRepository: {
    getById: (userId: string) => Promise<{ email: string } | null>;
  };
  enqueueJob: typeof enqueueJob;
};

export const defaultOnboardingCommitDeps: OnboardingCommitDeps = {
  requireUserId,
  userRepository: repositories.user,
  enqueueJob
};

export async function handleOnboardingCommitPost(
  request: NextRequest,
  deps: OnboardingCommitDeps = defaultOnboardingCommitDeps
) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const { primaryType, recommendedProtocol } = body as {
      primaryType?: string;
      recommendedProtocol?: string;
    };

    if (!primaryType || !recommendedProtocol) {
      return badRequest("primaryType and recommendedProtocol are required");
    }

    if (!(VALID_PRIMARY_TYPES as readonly string[]).includes(primaryType)) {
      return badRequest("Invalid primaryType");
    }

    const user = await deps.userRepository.getById(auth.userId);
    if (!user) return badRequest("User not found");

    const payload: OnboardingEmailPayload = {
      email: user.email,
      primaryType,
      recommendedProtocol
    };

    const results = await Promise.all([
      deps.enqueueJob("onboarding.email_day1", payload, { delayMs: 0 }),
      deps.enqueueJob("onboarding.email_day2", payload, { delayMs: 2 * DAY }),
      deps.enqueueJob("onboarding.email_day4", payload, { delayMs: 4 * DAY }),
      deps.enqueueJob("onboarding.email_day6", payload, { delayMs: 6 * DAY }),
      deps.enqueueJob("onboarding.email_day7", payload, { delayMs: 7 * DAY }),
      deps.enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 2 }, { delayMs: 14 * DAY }),
      deps.enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 3 }, { delayMs: 21 * DAY }),
      deps.enqueueJob("onboarding.email_weekly", { ...payload, weekNumber: 4 }, { delayMs: 28 * DAY }),
    ]);

    const failedCount = results.filter((r) => !r).length;
    if (failedCount > 0) {
      logger.error("Onboarding email jobs partially failed", { userId: auth.userId, failedCount });
      return NextResponse.json(
        { success: true, data: { scheduled: true, warning: "Some onboarding emails could not be queued. Our team has been notified." } },
        { status: 202 }
      );
    }

    return ok({ scheduled: true });
  } catch (error) {
    return serverError(error);
  }
}
