export interface MetricsRecorder {
  increment(name: string, tags?: Record<string, string>): void;
  timing(name: string, durationMs: number, tags?: Record<string, string>): void;
}
