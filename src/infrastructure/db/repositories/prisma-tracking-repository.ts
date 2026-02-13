import type { DailyCheckin } from "@/domain/entities/tracking";
import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import { createId } from "@/lib/ids/create-id";
import { prisma } from "@/infrastructure/db/prisma-client";

function mapCheckin(row: {
  id: string;
  userId: string;
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
  note: string | null;
  createdAt: Date;
}): DailyCheckin {
  return {
    id: row.id,
    userId: row.userId,
    dayKey: row.dayKey,
    focus: row.focus,
    calm: row.calm,
    energy: row.energy,
    note: row.note,
    createdAt: row.createdAt.toISOString()
  };
}

export class PrismaTrackingRepository implements TrackingRepository {
  async upsertDailyCheckin(input: {
    userId: string;
    dayKey: string;
    focus: number;
    calm: number;
    energy: number;
    note?: string;
  }): Promise<DailyCheckin> {
    const row = await prisma.checkin.upsert({
      where: {
        userId_dayKey: {
          userId: input.userId,
          dayKey: input.dayKey
        }
      },
      update: {
        focus: input.focus,
        calm: input.calm,
        energy: input.energy,
        note: input.note ?? null
      },
      create: {
        id: createId(),
        userId: input.userId,
        dayKey: input.dayKey,
        focus: input.focus,
        calm: input.calm,
        energy: input.energy,
        note: input.note ?? null
      }
    });

    return mapCheckin(row);
  }

  async getHistory(userId: string, limit: number): Promise<DailyCheckin[]> {
    const rows = await prisma.checkin.findMany({
      where: { userId },
      orderBy: { dayKey: "desc" },
      take: limit
    });

    return rows.map(mapCheckin);
  }

  async getLatest(userId: string): Promise<DailyCheckin | null> {
    const history = await this.getHistory(userId, 1);
    return history[0] ?? null;
  }
}
