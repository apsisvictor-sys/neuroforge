import type { TrackingRepository } from "@/domain/repositories/tracking-repository";

export type MetricTrendDay = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
};

export async function getMetricTrends(params: {
  userId: string;
  trackingRepository: TrackingRepository;
}): Promise<MetricTrendDay[]> {
  const history = await params.trackingRepository.getHistory(params.userId, 30);
  // Return sorted oldest-first for charts
  return [...history]
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey))
    .map((c) => ({ dayKey: c.dayKey, focus: c.focus, calm: c.calm, energy: c.energy }));
}
