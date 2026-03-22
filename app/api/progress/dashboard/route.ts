import { withApiLogging } from "@/lib/api";
import { ok, serverError } from "@/lib/api";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getProgressDashboard } from "@/application/use-cases/get-progress-dashboard";

export const GET = withApiLogging("/api/progress/dashboard", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const dashboard = await getProgressDashboard({
      userId: auth.userId,
      trackingRepository: repositories.tracking,
      protocolRepository: repositories.protocol,
      userRepository: repositories.user,
    });

    if (!dashboard) {
      return ok({ dashboard: null });
    }

    return ok({ dashboard });
  } catch (error) {
    return serverError(error);
  }
});
