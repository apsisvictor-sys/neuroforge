import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { setSessionCookie } from "@/infrastructure/auth/session";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";

export const POST = withApiLogging("/api/auth/verify", "POST", async (request: NextRequest) => {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    if (!token) {
      return badRequest("Token is required");
    }

    const magic = await repositories.auth.consumeMagicLinkToken(token);
    if (!magic) {
      return badRequest("Invalid or expired token");
    }

    const sessionToken = await repositories.auth.createSession(
      magic.userId,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    await setSessionCookie(sessionToken);
    await repositories.user.touch(magic.userId);

    return ok({ success: true });
  } catch (error) {
    return serverError(error);
  }
});
