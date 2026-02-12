import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { getTodayView } from "@/application/use-cases/get-today-view";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/today", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const view = await getTodayView({
      userId: auth.userId,
      now: new Date(),
      userRepository: repositories.user,
      protocolRepository: repositories.protocol,
      trackingRepository: repositories.tracking
    });

    return ok(view);
  } catch (error) {
    return serverError(error);
  }
});
