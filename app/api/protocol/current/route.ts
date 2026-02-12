import { ensureEnrollment } from "@/application/use-cases/bootstrap-enrollment";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/protocol/current", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const enrollment = await ensureEnrollment({
      userId: auth.userId,
      protocolRepository: repositories.protocol
    });

    const protocol = await repositories.protocol.getTemplateById(enrollment.protocolId);

    return ok({ enrollment, protocol });
  } catch (error) {
    return serverError(error);
  }
});
