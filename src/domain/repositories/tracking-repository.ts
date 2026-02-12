import type { DailyCheckin } from "@/domain/entities/tracking";

export interface TrackingRepository {
  upsertDailyCheckin(input: {
    userId: string;
    dayKey: string;
    focus: number;
    calm: number;
    energy: number;
    note?: string;
  }): Promise<DailyCheckin>;
  getHistory(userId: string, limit: number): Promise<DailyCheckin[]>;
  getLatest(userId: string): Promise<DailyCheckin | null>;
}
