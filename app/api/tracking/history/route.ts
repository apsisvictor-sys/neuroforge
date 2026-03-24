import { NextRequest } from "next/server";
import { getTrackingHistory } from "@/application/use-cases/get-tracking-history";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { ok, serverError, withApiLogging } from "@/lib/api";

function parseLimit(raw: string | null): number {
  const defaultLimit = 30;
  const maxLimit = 100;

  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return defaultLimit;
  }

  if (parsed <= 0) {
    return defaultLimit;
  }

  return Math.min(maxLimit, parsed);
}

export const GET = withApiLogging("/api/tracking/history", "GET", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const limit = parseLimit(request.nextUrl.searchParams.get("limit"));
    void request.nextUrl.searchParams.get("cursor");

    const history = await getTrackingHistory({
      userId: auth.userId,
      limit,
      trackingRepository: repositories.tracking
    });

    return ok({ history });
  } catch (error) {
    return serverError(error);
  }
});
