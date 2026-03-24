import type { MetricsRecorder } from "@/domain/metrics/metrics-recorder";

export class NoopMetricsRecorder implements MetricsRecorder {
  increment(_name: string, _tags?: Record<string, string>): void {}

  timing(_name: string, _durationMs: number, _tags?: Record<string, string>): void {}
}

export const noopMetricsRecorder: MetricsRecorder = new NoopMetricsRecorder();
