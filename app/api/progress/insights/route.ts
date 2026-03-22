import { withApiLogging } from "@/lib/api";
import { ok, serverError } from "@/lib/api";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { requireSubscriptionTier } from "@/infrastructure/auth/access-control";
import { getPatternInsights } from "@/application/use-cases/get-pattern-insights";

export const GET = withApiLogging("/api/progress/insights", "GET", async () => {
  const auth = await requireUserId();
  if ("response" in auth) return auth.response;

  // Throws AppError(403) for non-Premium — bubbles up to withApiContext which returns proper 403
  await requireSubscriptionTier(auth.userId, "premium", repositories.user);

  try {
    const insights = await getPatternInsights({
      userId: auth.userId,
      trackingRepository: repositories.tracking,
      protocolRepository: repositories.protocol,
    });

    return ok({ insights });
  } catch (error) {
    return serverError(error);
  }
});
