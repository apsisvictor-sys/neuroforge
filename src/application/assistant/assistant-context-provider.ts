import { toDayKey } from "../../lib/time/day-key.ts";
import { resolveProtocolDayNumber } from "../../protocol-engine/progression/day-number.ts";
import { resolvePhaseByDay } from "../../protocol-engine/progression/resolve-phase.ts";
import type { ProtocolRepository } from "../../domain/repositories/protocol-repository.ts";
import type { TrackingRepository } from "../../domain/repositories/tracking-repository.ts";
import type { UserRepository } from "../../domain/repositories/user-repository.ts";
import type { UserStateRepository } from "../../domain/repositories/user-state-repository.ts";
import type { AssistantContextInput } from "./assistant-context-input.ts";

type ExtraRepos = {
  trackingRepository?: TrackingRepository | null;
  userRepository?: UserRepository | null;
  userStateRepository?: UserStateRepository | null;
};

export async function buildAssistantContextInput(
  userId: string,
  protocolRepository: ProtocolRepository | null,
  extraRepos: ExtraRepos = {}
): Promise<AssistantContextInput> {
  if (!protocolRepository) {
    return {};
  }

  const enrollment = await protocolRepository.getActiveEnrollment(userId);
  if (!enrollment) {
    return {};
  }

  const protocolTemplate = await protocolRepository.getTemplateById(enrollment.protocolId);
  const now = new Date();
  const currentDay = resolveProtocolDayNumber(enrollment.startDate, now);
  const todayTasks = await protocolRepository.listDailyTasks(userId, toDayKey(now, "UTC"));
  const todayPhaseName = protocolTemplate ? resolvePhaseByDay(protocolTemplate, currentDay).name : undefined;

  // Enhanced context (Phase 5.1)
  let nervousSystemType: string | null = null;
  let recentCheckins: AssistantContextInput["recentCheckins"] = undefined;
  let recentCompletionRate: number | null = null;
  let userState: AssistantContextInput["userState"] = undefined;

  if (extraRepos.trackingRepository) {
    const checkins = await extraRepos.trackingRepository.getHistory(userId, 7);
    recentCheckins = checkins.map((c) => ({
      dayKey: c.dayKey,
      focus: c.focus,
      calm: c.calm,
      energy: c.energy
    }));
  }

  if (extraRepos.userRepository) {
    const profile = await extraRepos.userRepository.getProfile(userId);
    nervousSystemType = profile?.onboardingAnswers?.assessment?.primaryType ?? null;
  }

  if (extraRepos.userStateRepository) {
    userState = await extraRepos.userStateRepository.getState(userId);
    if (userState) {
      recentCompletionRate = userState.complianceScore;
    }
  }

  if (recentCompletionRate === null) {
    const summaries = await protocolRepository.getDailyCompletionSummaries(userId, 7);
    if (summaries.length > 0) {
      const totalTasks = summaries.reduce((sum, s) => sum + s.totalCount, 0);
      const completedTasks = summaries.reduce((sum, s) => sum + s.completedCount, 0);
      recentCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : null;
    }
  }

  return {
    protocolTemplate: protocolTemplate ?? undefined,
    enrollment,
    todayTasks: todayTasks.map((task) => ({ title: task.title, completed: task.completed })),
    todayPhaseName,
    currentDay,
    nervousSystemType,
    recentCheckins,
    recentCompletionRate,
    userState
  };
}
