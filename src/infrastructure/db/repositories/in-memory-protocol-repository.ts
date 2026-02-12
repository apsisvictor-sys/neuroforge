import type { DailyTaskInstance, ProtocolTemplate, StreakState, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import { protocolTemplates } from "@/protocol-engine/definitions/templates";
import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "./memory-store";

export class InMemoryProtocolRepository implements ProtocolRepository {
  async listTemplates(): Promise<ProtocolTemplate[]> {
    return protocolTemplates;
  }

  async getTemplateById(id: string): Promise<ProtocolTemplate | null> {
    return protocolTemplates.find((protocol) => protocol.id === id) ?? null;
  }

  async getTemplateBySlug(slug: string): Promise<ProtocolTemplate | null> {
    return protocolTemplates.find((protocol) => protocol.slug === slug) ?? null;
  }

  async getActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null> {
    return getMemoryStore().enrollments.find((item) => item.userId === userId && item.active) ?? null;
  }

  async enroll(userId: string, protocolId: string, startDate: string): Promise<UserProtocolEnrollment> {
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
}
