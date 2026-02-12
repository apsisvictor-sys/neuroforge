import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/profile", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const profile = await repositories.user.getProfile(auth.userId);
    return ok({ profile });
  } catch (error) {
    return serverError(error);
  }
});

export const PUT = withApiLogging("/api/profile", "PUT", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const displayName = String(body.displayName ?? "").trim();
    const timezone = String(body.timezone ?? "").trim();

    if (!displayName || !timezone) {
      return badRequest("displayName and timezone are required");
    }

    const profile = await repositories.user.upsertProfile({
      userId: auth.userId,
      displayName,
      timezone
    });

    return ok({ profile });
  } catch (error) {
    return serverError(error);
  }
});
