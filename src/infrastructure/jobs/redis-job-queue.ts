import type { JobQueue } from "@/domain/jobs/job-queue";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const JOB_QUEUE_NAME = "neuroforge-jobs";
const DEFAULT_ATTEMPTS = 3;
const BACKOFF_DELAY_MS = 1_000;

let queueInstance: Queue | null = null;
let redisConnectionInstance: IORedis | null = null;

function readRedisEnv(): { host: string; port: number; password?: string } {
  const host = process.env.REDIS_HOST?.trim();
  const rawPort = process.env.REDIS_PORT?.trim();
  const password = process.env.REDIS_PASSWORD?.trim() || undefined;

  if (!host || !rawPort) {
    throw new Error("Redis configuration missing: REDIS_HOST and REDIS_PORT are required");
  }

  const port = Number.parseInt(rawPort, 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("Invalid REDIS_PORT: expected a positive integer");
  }

  return { host, port, password };
}

function getOrCreateRedisConnection(): IORedis {
  if (redisConnectionInstance) {
    return redisConnectionInstance;
  }

  const { host, port, password } = readRedisEnv();
  redisConnectionInstance = new IORedis({
    host,
    port,
    password,
    maxRetriesPerRequest: null,
    retryStrategy: () => null
  });
  return redisConnectionInstance;
}

async function getQueue(): Promise<Queue> {
  if (queueInstance) {
    return queueInstance;
  }

  const connection = getOrCreateRedisConnection();
  try {
    await connection.ping();
  } catch {
    connection.disconnect();
    throw new Error("Redis connection failed");
  }

  // Pass plain options to BullMQ so it uses its own internal ioredis instance.
  // Avoids a TypeScript structural type conflict between top-level ioredis and
  // the ioredis bundled inside bullmq/node_modules.
  const { host, port, password } = readRedisEnv();
  queueInstance = new Queue(JOB_QUEUE_NAME, {
    connection: { host, port, password, maxRetriesPerRequest: null },
    defaultJobOptions: {
      attempts: DEFAULT_ATTEMPTS,
      backoff: { type: "exponential", delay: BACKOFF_DELAY_MS },
      removeOnComplete: true,
      removeOnFail: false
    }
  });

  return queueInstance;
}

export class RedisJobQueue implements JobQueue {
  async enqueue<T>(
    jobName: string,
    payload: T,
    options?: {
      attempts?: number;
      delayMs?: number;
    }
  ): Promise<void> {
    const queue = await getQueue();
    await queue.add(jobName, payload, {
      attempts: options?.attempts ?? DEFAULT_ATTEMPTS,
      delay: options?.delayMs ?? 0,
      backoff: { type: "exponential", delay: BACKOFF_DELAY_MS }
    });
  }
}

let redisJobQueueSingleton: RedisJobQueue | null = null;

export function getRedisJobQueue(): RedisJobQueue {
  if (!redisJobQueueSingleton) {
    redisJobQueueSingleton = new RedisJobQueue();
  }
  return redisJobQueueSingleton;
}

export function getRedisQueueName(): string {
  return JOB_QUEUE_NAME;
}

export function assertRedisJobConfiguration(): void {
  readRedisEnv();
}

export function createRedisClient(): IORedis {
  const { host, port, password } = readRedisEnv();
  return new IORedis({
    host,
    port,
    password,
    maxRetriesPerRequest: null,
    retryStrategy: () => null
  });
}

export function getRedisConnection(): IORedis {
  return getOrCreateRedisConnection();
}
