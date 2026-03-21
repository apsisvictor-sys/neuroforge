import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { computeAssessment } from "@/domain/assessment/scoring";
import type { AssessmentResponses } from "@/domain/assessment/types";

// POST /api/assessment — submit 12 responses, compute result, persist to profile
export const POST = withApiLogging("/api/assessment", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const responses: AssessmentResponses = body.responses;

    // Validate all 12 questions are present and values are 1–5
    for (let i = 1; i <= 12; i++) {
      const key = `q${i}` as keyof AssessmentResponses;
      const val = responses?.[key];
      if (typeof val !== "number" || val < 1 || val > 5) {
        return badRequest(`Invalid or missing response for question ${i} (expected 1–5)`);
      }
    }

    const result = computeAssessment(responses);
    const profile = await repositories.user.saveAssessment(auth.userId, result);

    return ok({ result, profile });
  } catch (error) {
    return serverError(error);
  }
});

// GET /api/assessment — retrieve the user's saved assessment result
export const GET = withApiLogging("/api/assessment", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const profile = await repositories.user.getProfile(auth.userId);
    const result = profile?.onboardingAnswers?.assessment ?? null;

    return ok({ result });
  } catch (error) {
    return serverError(error);
  }
});
