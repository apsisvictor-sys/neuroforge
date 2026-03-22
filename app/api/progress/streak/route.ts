import { withApiLogging } from "@/lib/api";
import { ok, serverError } from "@/lib/api";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { getStreakCalendar } from "@/application/use-cases/get-streak-calendar";

export const GET = withApiLogging("/api/progress/streak", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const days = await getStreakCalendar({
      userId: auth.userId,
      protocolRepository: repositories.protocol,
    });

    return ok({ days });
  } catch (error) {
    return serverError(error);
  }
});
