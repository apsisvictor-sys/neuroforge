import { NextRequest } from "next/server";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { requireString } from "@/lib/validate";

export const POST = withApiLogging("/api/protocol/enroll", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    let protocolId: string;
    try {
      protocolId = requireString(String(body.protocolId ?? ""), "protocolId");
    } catch {
      return badRequest("protocolId is required");
    }

    const enrollment = await repositories.protocol.enroll(auth.userId, protocolId, new Date().toISOString());
    return ok({ enrollment });
  } catch (error) {
    return serverError(error);
  }
});
