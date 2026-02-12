import type { TrackingRepository } from "@/domain/repositories/tracking-repository";

export type DailyCheckinDTO = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
  note?: string;
};

export async function submitDailyCheckin(input: {
  userId: string;
  payload: DailyCheckinDTO;
  trackingRepository: TrackingRepository;
}): Promise<DailyCheckinDTO> {
  if (input.payload.focus < 0 || input.payload.focus > 10) throw new Error("Focus must be 0-10");
  if (input.payload.calm < 0 || input.payload.calm > 10) throw new Error("Calm must be 0-10");
  if (input.payload.energy < 0 || input.payload.energy > 10) throw new Error("Energy must be 0-10");

  const saved = await input.trackingRepository.upsertDailyCheckin({
    userId: input.userId,
    dayKey: input.payload.dayKey,
    focus: input.payload.focus,
    calm: input.payload.calm,
    energy: input.payload.energy,
    note: input.payload.note
  });

  return {
    dayKey: saved.dayKey,
    focus: saved.focus,
    calm: saved.calm,
    energy: saved.energy,
    note: saved.note ?? undefined
  };
}
