import { logger } from "@/infrastructure/logging/logger";
import { startJobsWorker } from "@/infrastructure/jobs/worker";

startJobsWorker()
  .then(() => {
    logger.info("Worker bootstrap complete");
  })
  .catch((error) => {
    logger.error("Worker bootstrap failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    process.exit(1);
  });
