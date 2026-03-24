import { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleOnboardingCommitPost } from "@/infrastructure/api-handlers/onboarding-commit-handler";

export const POST = withApiLogging("/api/onboarding/commit", "POST", async (request: NextRequest) =>
  handleOnboardingCommitPost(request)
);
