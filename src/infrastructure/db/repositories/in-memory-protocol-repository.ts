import type { DailyCompletionSummary, DailyTaskInstance, ProtocolCatalogItem, ProtocolTemplate, StreakState, UserProtocolEnrollment } from "../../../domain/entities/protocol.ts";
import type { ProtocolRepository } from "../../../domain/repositories/protocol-repository.ts";
import { NotFoundError } from "../../errors/common-errors.ts";
import { toProtocolCatalogItem } from "../../../protocol-engine/definitions/map-catalog-item.ts";
import { createId } from "../../../lib/ids/create-id.ts";
import { getMemoryStore } from "./memory-store.ts";
import { memoizedProtocolTemplateDefinitions } from "./protocol-template-cache.ts";

export class InMemoryProtocolRepository implements ProtocolRepository {
  private readonly templates: ProtocolTemplate[];
  private readonly catalogItems: ProtocolCatalogItem[];

  constructor(templates: ProtocolTemplate[] = memoizedProtocolTemplateDefinitions.templates as ProtocolTemplate[]) {
    this.templates = templates;
    this.catalogItems =
      templates === memoizedProtocolTemplateDefinitions.templates
        ? (memoizedProtocolTemplateDefinitions.catalogItems as ProtocolCatalogItem[])
        : templates.map(toProtocolCatalogItem);
  }

  async listTemplates(): Promise<ProtocolTemplate[]> {
    return this.templates;
  }

  async listTemplateCatalog(): Promise<ProtocolCatalogItem[]> {
    return this.catalogItems;
  }

  async getTemplateById(id: string): Promise<ProtocolTemplate | null> {
    return this.templates.find((protocol) => protocol.id === id) ?? null;
  }

  async getTemplateBySlug(slug: string): Promise<ProtocolTemplate | null> {
    return this.templates.find((protocol) => protocol.slug === slug) ?? null;
  }

  async getActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null> {
    return getMemoryStore().enrollments.find((item) => item.userId === userId && item.active) ?? null;
  }

  async enroll(userId: string, protocolId: string, startDate: string): Promise<UserProtocolEnrollment> {
    const template = await this.getTemplateById(protocolId);
    if (!template) {
      throw new NotFoundError("Protocol template not found");
    }

    const current = await this.getActiveEnrollment(userId);
    if (current) return current;

    const enrollment: UserProtocolEnrollment = {
      id: createId(),
      userId,
      protocolId,
      startDate,
      active: true
    };

    getMemoryStore().enrollments.push(enrollment);
    return enrollment;
  }

  async listDailyTasks(userId: string, dayKey: string): Promise<DailyTaskInstance[]> {
    return getMemoryStore().dailyTasks
      .filter((task) => task.userId === userId && task.dayKey === dayKey)
      .sort((a, b) => a.order - b.order);
  }

  async replaceDailyTasks(userId: string, dayKey: string, tasks: DailyTaskInstance[]): Promise<void> {
    const store = getMemoryStore();
    store.dailyTasks = store.dailyTasks.filter((task) => !(task.userId === userId && task.dayKey === dayKey));
    store.dailyTasks.push(...tasks);
  }

  async toggleTask(taskId: string): Promise<DailyTaskInstance | null> {
    const task = getMemoryStore().dailyTasks.find((item) => item.id === taskId);
    if (!task) return null;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    return task;
  }

  async getStreak(userId: string): Promise<StreakState> {
    const streak = getMemoryStore().streaks.find((candidate) => candidate.userId === userId);
    if (streak) return streak;

    const initial: StreakState = {
      userId,
      currentStreak: 0,
      lastQualifiedDayKey: null
    };

    getMemoryStore().streaks.push(initial);
    return initial;
  }

  async saveStreak(streak: StreakState): Promise<void> {
    const store = getMemoryStore();
    const index = store.streaks.findIndex((item) => item.userId === streak.userId);
    if (index >= 0) {
      store.streaks[index] = streak;
      return;
    }

    store.streaks.push(streak);
  }

  async getDailyCompletionSummaries(userId: string, days: number): Promise<DailyCompletionSummary[]> {
    const allTasks = getMemoryStore().dailyTasks.filter((t) => t.userId === userId);

    const grouped = new Map<string, { completed: number; total: number }>();
    for (const task of allTasks) {
      const existing = grouped.get(task.dayKey) ?? { completed: 0, total: 0 };
      existing.total++;
      if (task.completed) existing.completed++;
      grouped.set(task.dayKey, existing);
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
