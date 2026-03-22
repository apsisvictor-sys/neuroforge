import { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleAcceptProposal } from "@/infrastructure/api-handlers/adaptation-handler";

export const POST = withApiLogging(
  "/api/adaptation/proposals/[id]/accept",
  "POST",
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const params = await context.params;
    return handleAcceptProposal(request, params);
  }
);
