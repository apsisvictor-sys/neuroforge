import type { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleSupplementStack } from "@/infrastructure/api-handlers/supplement-handler";

export const GET = withApiLogging(
  "/api/supplements/stacks/[phase]",
  "GET",
  (request: NextRequest, context: { params: Promise<{ phase: string }> }) =>
    context.params.then((params) => handleSupplementStack(request, params))
);
