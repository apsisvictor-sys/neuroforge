export interface JobQueue {
  enqueue<T>(
    jobName: string,
    payload: T,
    options?: {
      attempts?: number;
      delayMs?: number;
    }
  ): Promise<void>;
}
