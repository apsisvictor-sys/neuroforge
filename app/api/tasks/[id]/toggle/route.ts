import { NextRequest } from "next/server";
import { toggleTask } from "@/application/use-cases/toggle-task";
import { consumeNonce } from "@/infrastructure/auth/nonce";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";

export const POST = withApiLogging(
  "/api/tasks/[id]/toggle",
  "POST",
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const nonce = request.headers.get("x-nonce");
    if (!nonce || !consumeNonce(auth.userId, nonce)) {
      return badRequest("Invalid nonce");
    }

    const { id } = await context.params;
    const data = await toggleTask({ taskId: id, protocolRepository: repositories.protocol });
    return ok(data);
  } catch (error) {
    return serverError(error);
  }
  }
);
