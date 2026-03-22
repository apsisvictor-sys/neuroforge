import { withApiLogging } from "@/lib/api";
import { ok, serverError } from "@/lib/api";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getMetricTrends } from "@/application/use-cases/get-metric-trends";

export const GET = withApiLogging("/api/progress/trends", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const trends = await getMetricTrends({
      userId: auth.userId,
      trackingRepository: repositories.tracking,
    });

    return ok({ trends });
  } catch (error) {
    return serverError(error);
  }
});
