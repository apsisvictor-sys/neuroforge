import { success } from "@/infrastructure/api/api-response";
import { withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/health", "GET", async () => {
  return success(
    {
      status: "ok",
      service: "neuroforge",
      time: new Date().toISOString()
    }
  );
});
