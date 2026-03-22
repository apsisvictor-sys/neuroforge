import type { DailyCompletionSummary, DailyTaskInstance, ProtocolCatalogItem, ProtocolTemplate, StreakState, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import { prisma } from "@/infrastructure/db/prisma-client";
import { NotFoundError } from "@/infrastructure/errors/common-errors";
import { createId } from "@/lib/ids/create-id";
import { memoizedProtocolTemplateDefinitions } from "./protocol-template-cache";
import type { TaskCategory } from "@/domain/types/common";

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

function mapTask(row: {
  id: string;
  userId: string;
  protocolId: string;
  phaseId: string;
  dayKey: string;
  taskDefinitionId: string;
  title: string;
  instructions: string;
  category: string;
  estimatedMinutes: number;
  order: number;
  required: boolean;
  completed: boolean;
  completedAt: Date | null;
}): DailyTaskInstance {
  return {
    id: row.id,
    userId: row.userId,
    protocolId: row.protocolId,
    phaseId: row.phaseId,
    dayKey: row.dayKey,
    taskDefinitionId: row.taskDefinitionId,
    title: row.title,
    instructions: row.instructions,
    category: row.category as TaskCategory,
    estimatedMinutes: row.estimatedMinutes,
    order: row.order,
    required: row.required,
    completed: row.completed,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null
  };
}

export class PrismaProtocolRepository implements ProtocolRepository {
  async listTemplates(): Promise<ProtocolTemplate[]> {
    return memoizedProtocolTemplateDefinitions.templates as ProtocolTemplate[];
  }

  async listTemplateCatalog(): Promise<ProtocolCatalogItem[]> {
    return memoizedProtocolTemplateDefinitions.catalogItems as ProtocolCatalogItem[];
  }

  async getTemplateById(id: string): Promise<ProtocolTemplate | null> {
    return memoizedProtocolTemplateDefinitions.templates.find((protocol) => protocol.id === id) ?? null;
  }

  async getTemplateBySlug(slug: string): Promise<ProtocolTemplate | null> {
    return memoizedProtocolTemplateDefinitions.templates.find((protocol) => protocol.slug === slug) ?? null;
  }

  async getActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null> {
    const row = await prisma.enrollment.findFirst({
      where: { userId, active: true }
    });
    return row ? mapEnrollment(row) : null;
  }

  async enroll(userId: string, protocolId: string, startDate: string): Promise<UserProtocolEnrollment> {
    const template = await this.getTemplateById(protocolId);
    if (!template) {
      throw new NotFoundError("Protocol template not found");
    }

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

    return rows.map(mapTask);
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
            protocolId: task.protocolId,
            phaseId: task.phaseId,
            dayKey: task.dayKey,
            taskDefinitionId: task.taskDefinitionId,
            title: task.title,
            instructions: task.instructions,
            category: task.category,
            estimatedMinutes: task.estimatedMinutes,
            order: task.order,
            required: task.required,
            completed: task.completed,
            completedAt: task.completedAt ? new Date(task.completedAt) : null
          }))
        });
      }
    });
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

    return mapTask(row);
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

  async getDailyCompletionSummaries(userId: string, days: number): Promise<DailyCompletionSummary[]> {
    const rows = await prisma.dailyTask.findMany({
      where: { userId },
      select: { dayKey: true, completed: true }
    });

    const grouped = new Map<string, { completed: number; total: number }>();
    for (const row of rows) {
      const existing = grouped.get(row.dayKey) ?? { completed: 0, total: 0 };
      existing.total++;
      if (row.completed) existing.completed++;
      grouped.set(row.dayKey, existing);
    }

    const sortedKeys = Array.from(grouped.keys())
      .sort((a, b) => b.localeCompare(a))
      .slice(0, days);

    return sortedKeys.map((dayKey) => {
      const g = grouped.get(dayKey)!;
      return {
        dayKey,
        completedCount: g.completed,
        totalCount: g.total,
        completionScore: g.total > 0 ? g.completed / g.total : 0
      };
    });
  }
}
