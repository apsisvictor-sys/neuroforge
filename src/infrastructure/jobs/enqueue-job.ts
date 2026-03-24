import { logger } from "@/infrastructure/logging/logger";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";
import { getRedisJobQueue } from "@/infrastructure/jobs/redis-job-queue";

export async function enqueueJob<T>(
  jobName: string,
  payload: T,
  options?: {
    attempts?: number;
    delayMs?: number;
  }
): Promise<boolean> {
  try {
    await getRedisJobQueue().enqueue(jobName, payload, options);
    noopMetricsRecorder.increment("jobs.enqueued", { jobName });
    return true;
  } catch (error) {
    noopMetricsRecorder.increment("jobs.failed", { jobName });
    logger.error("Job enqueue failed — continuing without job", {
      jobName,
      error: error instanceof Error ? error.message : String(error)
    });
    // Non-throwing: job queue is best-effort. Core request completes regardless.
    return false;
  }
}
