import { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleAssessmentGet, handleAssessmentPost } from "@/infrastructure/api-handlers/assessment-handler";

export const POST = withApiLogging("/api/assessment", "POST", async (request: NextRequest) =>
  handleAssessmentPost(request)
);

export const GET = withApiLogging("/api/assessment", "GET", async () => handleAssessmentGet());
