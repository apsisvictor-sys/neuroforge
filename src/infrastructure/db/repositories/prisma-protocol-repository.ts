import type { DailyTaskInstance, ProtocolCatalogItem, ProtocolTemplate, StreakState, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import { prisma } from "@/infrastructure/db/prisma-client";
import { protocolTemplates } from "@/protocol-engine/definitions/templates";
import { toProtocolCatalogItem } from "@/protocol-engine/definitions/map-catalog-item";
import { createId } from "@/lib/ids/create-id";

const taskCache = new Map<string, DailyTaskInstance>();

function mapEnrollment(row: {
  id: string;
  userId: string;
  protocolId: string;
  startDate: string;
  active: boolean;
}): UserProtocolEnrollment {
  return {
    id: row.id,
    userId: row.userId,
    protocolId: row.protocolId,
    startDate: row.startDate,
    active: row.active
  };
}

function mapTaskFromRow(row: {
  id: string;
  userId: string;
  dayKey: string;
  order: number;
  completed: boolean;
  completedAt: Date | null;
}): DailyTaskInstance {
  const cached = taskCache.get(row.id);
  if (!cached) {
    throw new Error(`Task metadata missing for DailyTaskInstance id: ${row.id}`);
  }

  return {
    ...cached,
    order: row.order,
    completed: row.completed,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null
  };
}

export class PrismaProtocolRepository implements ProtocolRepository {
  async listTemplates(): Promise<ProtocolTemplate[]> {
    return protocolTemplates;
  }

  async listTemplateCatalog(): Promise<ProtocolCatalogItem[]> {
    return protocolTemplates.map(toProtocolCatalogItem);
  }

  async getTemplateById(id: string): Promise<ProtocolTemplate | null> {
    return protocolTemplates.find((protocol) => protocol.id === id) ?? null;
  }

  async getTemplateBySlug(slug: string): Promise<ProtocolTemplate | null> {
    return protocolTemplates.find((protocol) => protocol.slug === slug) ?? null;
  }

  async getActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null> {
    const row = await prisma.enrollment.findFirst({
      where: { userId, active: true }
    });
    return row ? mapEnrollment(row) : null;
  }

  async enroll(userId: string, protocolId: string, startDate: string): Promise<UserProtocolEnrollment> {
    const current = await this.getActiveEnrollment(userId);
    if (current) return current;

    const row = await prisma.enrollment.create({
      data: {
        id: createId(),
        userId,
        protocolId,
        startDate,
        active: true
      }
    });

    return mapEnrollment(row);
  }

  async listDailyTasks(userId: string, dayKey: string): Promise<DailyTaskInstance[]> {
    const rows = await prisma.dailyTask.findMany({
      where: { userId, dayKey },
      orderBy: { order: "asc" }
    });

    return rows.map((row) =>
      mapTaskFromRow({
        id: row.id,
        userId: row.userId,
        dayKey: row.dayKey,
        order: row.order,
        completed: row.completed,
        completedAt: row.completedAt
      })
    );
  }

  async replaceDailyTasks(userId: string, dayKey: string, tasks: DailyTaskInstance[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.dailyTask.deleteMany({
        where: { userId, dayKey }
      });

      if (tasks.length > 0) {
        await tx.dailyTask.createMany({
          data: tasks.map((task) => ({
            id: task.id,
            userId: task.userId,
            dayKey: task.dayKey,
            order: task.order,
            completed: task.completed,
            completedAt: task.completedAt ? new Date(task.completedAt) : null
          }))
        });
      }
    });

    for (const task of tasks) {
      taskCache.set(task.id, task);
    }
  }

  async toggleTask(taskId: string): Promise<DailyTaskInstance | null> {
    const existing = await prisma.dailyTask.findUnique({
      where: { id: taskId }
    });
    if (!existing) return null;

    const completed = !existing.completed;
    const completedAt = completed ? new Date() : null;

    const row = await prisma.dailyTask.update({
      where: { id: taskId },
      data: { completed, completedAt }
    });

    const mapped = mapTaskFromRow({
      id: row.id,
      userId: row.userId,
      dayKey: row.dayKey,
      order: row.order,
      completed: row.completed,
      completedAt: row.completedAt
    });
    taskCache.set(taskId, mapped);
    return mapped;
  }

  async getStreak(userId: string): Promise<StreakState> {
    const row = await prisma.streak.findUnique({
      where: { userId }
    });
    if (row) {
      return {
        userId: row.userId,
        currentStreak: row.currentStreak,
        lastQualifiedDayKey: row.lastQualifiedDayKey
      };
    }

    const initial: StreakState = {
      userId,
      currentStreak: 0,
      lastQualifiedDayKey: null
    };

    await prisma.streak.create({
      data: initial
    });

    return initial;
  }

  async saveStreak(streak: StreakState): Promise<void> {
    await prisma.streak.upsert({
      where: { userId: streak.userId },
      update: {
        currentStreak: streak.currentStreak,
        lastQualifiedDayKey: streak.lastQualifiedDayKey
      },
      create: {
        userId: streak.userId,
        currentStreak: streak.currentStreak,
        lastQualifiedDayKey: streak.lastQualifiedDayKey
      }
    });
  }
}
