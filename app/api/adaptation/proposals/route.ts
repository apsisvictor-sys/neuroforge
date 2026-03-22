import { withApiLogging } from "@/lib/api";
import { handleGetProposals } from "@/infrastructure/api-handlers/adaptation-handler";

export const GET = withApiLogging("/api/adaptation/proposals", "GET", async () =>
  handleGetProposals()
);
