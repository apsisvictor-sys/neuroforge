import type { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleSupplementDetail } from "@/infrastructure/api-handlers/supplement-handler";

export const GET = withApiLogging(
  "/api/supplements/[id]",
  "GET",
  (request: NextRequest, context: { params: Promise<{ id: string }> }) =>
    context.params.then((params) => handleSupplementDetail(request, params))
);
