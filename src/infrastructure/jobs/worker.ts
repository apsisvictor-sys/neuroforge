import { Worker } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@/infrastructure/logging/logger";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";
import { assertRedisJobConfiguration, getRedisQueueName } from "@/infrastructure/jobs/redis-job-queue";
import {
  sendOnboardingDay1,
  sendOnboardingDay2,
  sendOnboardingDay4,
  sendOnboardingDay6,
  sendOnboardingDay7,
  sendOnboardingWeekly,
  type OnboardingEmailPayload,
} from "@/infrastructure/email/onboarding-emails";

type WorkerJob = {
  name: string;
  data: unknown;
};

export async function startJobsWorker(): Promise<void> {
  assertRedisJobConfiguration();

  const host = process.env.REDIS_HOST as string;
  const port = Number.parseInt(process.env.REDIS_PORT as string, 10);
  const password = process.env.REDIS_PASSWORD?.trim() || undefined;

  const connection = new IORedis({
    host,
    port,
    password,
    maxRetriesPerRequest: null,
    retryStrategy: () => null
  });

  new Worker(
    getRedisQueueName(),
    async (job: WorkerJob) => {
      try {
        switch (job.name) {
          case "email.send_magic_link":
            logger.info("Executing job email.send_magic_link", { jobName: job.name, payload: job.data });
            return;
          case "assistant.summarize_conversation":
            logger.info("Executing job assistant.summarize_conversation", { jobName: job.name, payload: job.data });
            return;
          case "streak.recompute":
            logger.info("Executing job streak.recompute", { jobName: job.name, payload: job.data });
            return;
          case "onboarding.email_day1":
            await sendOnboardingDay1(job.data as OnboardingEmailPayload);
            return;
          case "onboarding.email_day2":
            await sendOnboardingDay2(job.data as OnboardingEmailPayload);
            return;
          case "onboarding.email_day4":
            await sendOnboardingDay4(job.data as OnboardingEmailPayload);
            return;
          case "onboarding.email_day6":
            await sendOnboardingDay6(job.data as OnboardingEmailPayload);
            return;
          case "onboarding.email_day7":
            await sendOnboardingDay7(job.data as OnboardingEmailPayload);
            return;
          case "onboarding.email_weekly":
            await sendOnboardingWeekly(job.data as OnboardingEmailPayload & { weekNumber: number });
            return;
          default:
            logger.info("Executing job unknown", { jobName: job.name, payload: job.data });
        }
      } catch (error) {
        noopMetricsRecorder.increment("jobs.failed", { jobName: job.name });
        logger.error("Job execution failed", {
          jobName: job.name,
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }
    },
    { connection }
  );

  logger.info("Background jobs worker started", { queueName: getRedisQueueName() });
}
