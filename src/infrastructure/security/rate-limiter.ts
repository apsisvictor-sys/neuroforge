import { AppError } from "@/infrastructure/errors/app-error";
import { getRedisConnection } from "@/infrastructure/jobs/redis-job-queue";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

export async function enforceRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<void> {
  const redis = getRedisConnection();
  const key = `${options.keyPrefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const member = `${now}-${Math.random().toString(36).slice(2, 10)}`;

  let result: [Error | null, unknown][] | null;
  try {
    const tx = redis.multi();
    tx.zremrangebyscore(key, 0, windowStart - 1);
    tx.zadd(key, now, member);
    tx.zcard(key);
    tx.pexpire(key, options.windowMs);
    result = await tx.exec();
  } catch {
    noopMetricsRecorder.increment("rate_limit.redis_failure");
    // Fail open: Redis unavailable, allow request through rather than blocking all traffic.
    return;
  }
  const countRaw = result?.[2]?.[1];
  const count = typeof countRaw === "number" ? countRaw : Number(countRaw ?? 0);

  if (count >= options.maxRequests) {
    await redis.zrem(key, member);
    throw new AppError({
      message: "Too many requests",
      code: "RATE_LIMITED",
      httpStatus: 429,
      expose: true
    });
  }
}
