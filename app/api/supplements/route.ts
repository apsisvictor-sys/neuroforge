import type { NextRequest } from "next/server";
import { withApiLogging } from "@/lib/api";
import { handleSupplementList } from "@/infrastructure/api-handlers/supplement-handler";

export const GET = withApiLogging("/api/supplements", "GET", (request: NextRequest) =>
  handleSupplementList(request)
);
