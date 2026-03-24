import type { NextRequest } from "next/server";
import { badRequest, ok, serverError } from "@/lib/api";
import { computeAssessment } from "@/domain/assessment/scoring";
import type { AssessmentResponses } from "@/domain/assessment/types";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";

export type AssessmentRouteDeps = {
  requireUserId: typeof requireUserId;
  computeAssessment: typeof computeAssessment;
  userRepository: {
    saveAssessment: (userId: string, result: ReturnType<typeof computeAssessment>) => Promise<unknown>;
    getProfile: (userId: string) => Promise<{ onboardingAnswers?: { assessment?: unknown } | null } | null>;
  };
};

export const defaultAssessmentRouteDeps: AssessmentRouteDeps = {
  requireUserId,
  computeAssessment,
  userRepository: repositories.user
};

export async function handleAssessmentPost(
  request: NextRequest,
  deps: AssessmentRouteDeps = defaultAssessmentRouteDeps
) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const responses = body?.responses;
    if (!responses || typeof responses !== "object") {
      return badRequest("Invalid request: responses object is required");
    }

    for (let i = 1; i <= 12; i++) {
      const key = `q${i}` as keyof AssessmentResponses;
      const val = responses?.[key];
      if (typeof val !== "number" || val < 1 || val > 5) {
        return badRequest(`Invalid or missing response for question ${i} (expected 1-5)`);
      }
    }

    const result = deps.computeAssessment(responses);
    const profile = await deps.userRepository.saveAssessment(auth.userId, result);

    return ok({ result, profile });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleAssessmentGet(deps: AssessmentRouteDeps = defaultAssessmentRouteDeps) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const profile = await deps.userRepository.getProfile(auth.userId);
    const result = profile?.onboardingAnswers?.assessment ?? null;

    return ok({ result });
  } catch (error) {
    return serverError(error);
  }
}
