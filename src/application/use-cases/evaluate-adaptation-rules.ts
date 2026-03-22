import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { UserStateRepository } from "@/domain/repositories/user-state-repository";
import type { AdaptationRepository } from "@/domain/repositories/adaptation-repository";
import type { AdaptationProposal } from "@/domain/entities/adaptation";
import { evaluateAllRules } from "@/domain/adaptation/adaptation-rules";
import { resolveProtocolDayNumber } from "@/protocol-engine/progression/day-number";
import { resolvePhaseByDay } from "@/protocol-engine/progression/resolve-phase";

type EvaluateAdaptationRulesDeps = {
  userId: string;
  trackingRepository: TrackingRepository;
  protocolRepository: ProtocolRepository;
  userStateRepository: UserStateRepository;
  adaptationRepository: AdaptationRepository;
  generateId: () => string;
  today: Date; // injectable for testability
};

export async function evaluateAdaptationRules(
  deps: EvaluateAdaptationRulesDeps
): Promise<AdaptationProposal[]> {
  const {
    userId,
    trackingRepository,
    protocolRepository,
    userStateRepository,
    adaptationRepository,
    generateId,
    today
  } = deps;

  const state = await userStateRepository.getState(userId);
  if (!state) return [];

  const recentCheckins = await trackingRepository.getHistory(userId, 14);
  const recentSummaries = await protocolRepository.getDailyCompletionSummaries(userId, 14);

  // Optionally enrich with enrollment context for the early-phase-advance rule
  let enrollment: { dayNumber: number; currentPhase: import("@/domain/entities/protocol").ProtocolPhase } | undefined;
  const activeEnrollment = await protocolRepository.getActiveEnrollment(userId);
  if (activeEnrollment) {
    const template = await protocolRepository.getTemplateById(activeEnrollment.protocolId);
    if (template) {
      const dayNumber = resolveProtocolDayNumber(activeEnrollment.startDate, today);
      const currentPhase = resolvePhaseByDay(template, dayNumber);
      if (currentPhase) {
        enrollment = { dayNumber, currentPhase };
      }
    }
  }

  const triggered = evaluateAllRules({ state, recentCheckins, recentSummaries, enrollment });

  const newProposals: AdaptationProposal[] = [];
  for (const { ruleId, reasoning } of triggered) {
    // Dedup: skip if there is already a pending proposal for this rule
    const existing = await adaptationRepository.getPendingByRuleId(userId, ruleId);
    if (existing) continue;

    const proposal: AdaptationProposal = {
      id: generateId(),
      userId,
      ruleId,
      reasoning,
      status: "proposed",
      proposedAt: new Date().toISOString(),
      resolvedAt: null
    };

    await adaptationRepository.saveProposal(proposal);
    newProposals.push(proposal);
  }

  return newProposals;
}
