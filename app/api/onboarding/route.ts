import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { requireArray, requireString } from "@/lib/validate";

export const POST = withApiLogging("/api/onboarding", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    let workRhythm: string;
    let preferredTrainingWindow: string;
    try {
      workRhythm = requireString(String(body.workRhythm ?? ""), "workRhythm");
      preferredTrainingWindow = requireString(
        String(body.preferredTrainingWindow ?? ""),
        "preferredTrainingWindow"
      );
    } catch {
      return badRequest("workRhythm and preferredTrainingWindow are required");
    }

    const overwhelmTriggers = requireArray<string>(
      Array.isArray(body.overwhelmTriggers) ? body.overwhelmTriggers : [],
      "overwhelmTriggers"
    );
    const focusFrictionPatterns = requireArray<string>(
      Array.isArray(body.focusFrictionPatterns) ? body.focusFrictionPatterns : [],
      "focusFrictionPatterns"
    );

    const profile = await repositories.user.saveOnboarding(auth.userId, {
      workRhythm,
      overwhelmTriggers,
      preferredTrainingWindow,
      focusFrictionPatterns
    });

    return ok({ profile });
  } catch (error) {
    return serverError(error);
  }
});
