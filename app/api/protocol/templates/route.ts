import { repositories } from "@/infrastructure/db/repositories";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/protocol/templates", "GET", async () => {
  try {
    const templates = await repositories.protocol.listTemplates();
    return ok({ templates });
  } catch (error) {
    return serverError(error);
  }
});
