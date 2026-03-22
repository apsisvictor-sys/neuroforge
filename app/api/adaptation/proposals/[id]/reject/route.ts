import { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleRejectProposal } from "@/infrastructure/api-handlers/adaptation-handler";

export const POST = withApiLogging(
  "/api/adaptation/proposals/[id]/reject",
  "POST",
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    return handleRejectProposal(request, params);
  }
);
