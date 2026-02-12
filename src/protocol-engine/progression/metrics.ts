import type { DailyTaskInstance, DailyCompletionSummary, StreakState } from "@/domain/entities/protocol";

export function calculateCompletionSummary(dayKey: string, tasks: DailyTaskInstance[]): DailyCompletionSummary {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return {
    dayKey,
    completedCount,
    totalCount,
    completionScore: totalCount === 0 ? 0 : completedCount / totalCount
  };
}

export function updateStreak(input: {
  streak: StreakState;
  dayKey: string;
  completionScore: number;
  threshold: number;
}): StreakState {
  if (input.completionScore < input.threshold) {
    return {
      ...input.streak,
      currentStreak: 0,
      lastQualifiedDayKey: null
    };
  }

  if (input.streak.lastQualifiedDayKey === input.dayKey) {
    return input.streak;
  }

  return {
    ...input.streak,
    currentStreak: input.streak.currentStreak + 1,
    lastQualifiedDayKey: input.dayKey
  };
}
