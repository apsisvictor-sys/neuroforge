import { clearSession } from "@/infrastructure/auth/session";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const POST = withApiLogging("/api/auth/sign-out", "POST", async () => {
  try {
    await clearSession();
    return ok({ success: true });
  } catch (error) {
    return serverError(error);
  }
});
