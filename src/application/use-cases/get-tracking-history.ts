import type { TrackingRepository } from "@/domain/repositories/tracking-repository";

export type TrackingHistoryDTO = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
};

export async function getTrackingHistory(input: {
  userId: string;
  limit: number;
  trackingRepository: TrackingRepository;
}): Promise<TrackingHistoryDTO[]> {
  const rows = await input.trackingRepository.getHistory(input.userId, input.limit);

  return rows.map((row) => ({
    dayKey: row.dayKey,
    focus: row.focus,
    calm: row.calm,
    energy: row.energy
  }));
}
