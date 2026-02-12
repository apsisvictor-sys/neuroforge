import type { DailyTaskInstance } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import type { UserRepository } from "@/domain/repositories/user-repository";
import { ensureEnrollment } from "@/application/use-cases/bootstrap-enrollment";
import { toDayKey } from "@/lib/time/day-key";
import { calculateCompletionSummary, updateStreak } from "@/protocol-engine/progression/metrics";
import { materializeDailyTasks } from "@/protocol-engine/progression/materialize-tasks";
import { resolveProtocolDayNumber } from "@/protocol-engine/progression/day-number";
import { resolvePhaseByDay } from "@/protocol-engine/progression/resolve-phase";

export type TodayViewDTO = {
  dayKey: string;
  dayNumber: number;
  phaseId: string;
  phaseName: string;
  tasks: DailyTaskInstance[];
  completion: {
    completedCount: number;
    totalCount: number;
    score: number;
  };
  streak: number;
  latestCheckin: { focus: number; calm: number; energy: number } | null;
};

export async function getTodayView(input: {
  userId: string;
  now: Date;
  userRepository: UserRepository;
  protocolRepository: ProtocolRepository;
  trackingRepository: TrackingRepository;
}): Promise<TodayViewDTO> {
  const profile = await input.userRepository.getProfile(input.userId);
  if (!profile) {
    throw new Error("Profile not found");
  }

  const { protocolId, startDate } = await ensureEnrollment({
    userId: input.userId,
    protocolRepository: input.protocolRepository
  });

  const protocol = await input.protocolRepository.getTemplateById(protocolId);
  if (!protocol) {
    throw new Error("Protocol template not found");
  }

  const dayKey = toDayKey(input.now, profile.timezone || "UTC");
  const dayNumber = resolveProtocolDayNumber(startDate, input.now);
  const phase = resolvePhaseByDay(protocol, dayNumber);

  let tasks = await input.protocolRepository.listDailyTasks(input.userId, dayKey);
  if (tasks.length === 0) {
    tasks = materializeDailyTasks({
      userId: input.userId,
      dayKey,
      enrollment: {
        id: "virtual",
        userId: input.userId,
        protocolId,
        startDate,
        active: true
      },
      phase
    });
    await input.protocolRepository.replaceDailyTasks(input.userId, dayKey, tasks);
  }

  const summary = calculateCompletionSummary(dayKey, tasks);
  const streak = await input.protocolRepository.getStreak(input.userId);
  const updatedStreak = updateStreak({
    streak,
    dayKey,
    completionScore: summary.completionScore,
    threshold: 0.8
  });
  await input.protocolRepository.saveStreak(updatedStreak);

  const latest = await input.trackingRepository.getLatest(input.userId);

  return {
    dayKey,
    dayNumber,
    phaseId: phase.id,
    phaseName: phase.name,
    tasks,
    completion: {
      completedCount: summary.completedCount,
      totalCount: summary.totalCount,
      score: summary.completionScore
    },
    streak: updatedStreak.currentStreak,
    latestCheckin: latest
      ? {
          focus: latest.focus,
          calm: latest.calm,
          energy: latest.energy
        }
      : null
  };
}
