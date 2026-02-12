import type { DailyCheckin } from "@/domain/entities/tracking";
import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "./memory-store";

export class InMemoryTrackingRepository implements TrackingRepository {
  async upsertDailyCheckin(input: {
    userId: string;
    dayKey: string;
    focus: number;
    calm: number;
    energy: number;
    note?: string;
  }): Promise<DailyCheckin> {
    const existing = getMemoryStore().checkins.find(
      (entry) => entry.userId === input.userId && entry.dayKey === input.dayKey
    );

    if (existing) {
      existing.focus = input.focus;
      existing.calm = input.calm;
      existing.energy = input.energy;
      existing.note = input.note ?? null;
      return existing;
    }

    const checkin: DailyCheckin = {
      id: createId(),
      userId: input.userId,
      dayKey: input.dayKey,
      focus: input.focus,
      calm: input.calm,
      energy: input.energy,
      note: input.note ?? null,
      createdAt: new Date().toISOString()
    };

    getMemoryStore().checkins.push(checkin);
    return checkin;
  }

  async getHistory(userId: string, limit: number): Promise<DailyCheckin[]> {
    return getMemoryStore().checkins
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => (a.dayKey > b.dayKey ? -1 : 1))
      .slice(0, limit);
  }

  async getLatest(userId: string): Promise<DailyCheckin | null> {
    const history = await this.getHistory(userId, 1);
    return history[0] ?? null;
  }
}
