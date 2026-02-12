import { requireUserId } from "@/infrastructure/auth/require-user";
import { issueNonce } from "@/infrastructure/auth/nonce";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/auth/nonce", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const nonce = issueNonce(auth.userId);
    return ok({ nonce });
  } catch (error) {
    return serverError(error);
  }
});
