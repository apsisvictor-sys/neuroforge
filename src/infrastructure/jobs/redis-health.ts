import { createRedisClient } from "@/infrastructure/jobs/redis-job-queue";

export async function checkRedisHealth(): Promise<boolean> {
  const connection = createRedisClient();
  try {
    const pong = await connection.ping();
    return pong === "PONG";
  } catch {
    return false;
  } finally {
    connection.disconnect();
  }
}
