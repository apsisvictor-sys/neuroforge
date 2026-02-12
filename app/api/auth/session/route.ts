import { getSessionUserId } from "@/infrastructure/auth/session";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/auth/session", "GET", async () => {
  try {
    const userId = await getSessionUserId();
    return ok({ authenticated: Boolean(userId) });
  } catch (error) {
    return serverError(error);
  }
});
