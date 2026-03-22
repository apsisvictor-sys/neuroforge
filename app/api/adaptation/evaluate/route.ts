import { withApiLogging } from "@/lib/api";
import { handleEvaluate } from "@/infrastructure/api-handlers/adaptation-handler";

export const POST = withApiLogging("/api/adaptation/evaluate", "POST", async () =>
  handleEvaluate()
);
