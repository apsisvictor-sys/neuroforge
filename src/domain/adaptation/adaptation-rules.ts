import type { UserState } from "@/domain/entities/user-state";
import type { DailyCheckin } from "@/domain/entities/tracking";
import type { DailyCompletionSummary, ProtocolPhase } from "@/domain/entities/protocol";
import type { AdaptationRuleId } from "@/domain/entities/adaptation";

export type AdaptationContext = {
  state: UserState;
  recentCheckins: DailyCheckin[];
  recentSummaries: DailyCompletionSummary[];
  enrollment?: {
    dayNumber: number;
    currentPhase: ProtocolPhase;
  };
};

export type TriggeredRule = {
  ruleId: AdaptationRuleId;
  reasoning: string;
};

/**
 * Rule 1: If the 3 most recent check-ins all have energy < 4, suggest a recovery day.
 * Proxy for "fatigueIndex > 0.8 for 3 consecutive days" using available check-in data.
 */
function evaluateFatigueRecoveryDay(ctx: AdaptationContext): TriggeredRule | null {
  const { recentCheckins } = ctx;
  const last3 = recentCheckins.slice(0, 3);
  if (last3.length < 3) return null;

  const allLowEnergy = last3.every((c) => c.energy < 4);
  if (!allLowEnergy) return null;

  const avgEnergy = Math.round(last3.reduce((sum, c) => sum + c.energy, 0) / 3);
  return {
    ruleId: "fatigue-recovery-day",
    reasoning: `Your last 3 check-ins show consistently low energy (average ${avgEnergy}/10). This pattern indicates accumulated fatigue. I recommend scheduling a recovery day — lighter activities and rest to allow your nervous system to reset.`
  };
}

/**
 * Rule 2: If overstimulationFlag is active, suggest shifting to Pillar 3 (regulation).
 */
function evaluateOverstimulationRegulationShift(ctx: AdaptationContext): TriggeredRule | null {
  const { state } = ctx;
  if (!state.overstimulationFlag) return null;

  return {
    ruleId: "overstimulation-regulation-shift",
    reasoning: `Your recent data shows signs of overstimulation — low calm scores (below 4/10) combined with task completion below 50%. Based on this, I recommend temporarily shifting focus to Pillar 3 (Nervous System Regulation) to restore baseline calm before continuing with higher-demand tasks.`
  };
}

/**
 * Rule 3: If complianceScore < 40%, suggest reducing protocol difficulty.
 */
function evaluateComplianceDifficultyReduction(ctx: AdaptationContext): TriggeredRule | null {
  const { state } = ctx;
  if (state.complianceScore >= 40) return null;

  return {
    ruleId: "compliance-difficulty-reduction",
    reasoning: `Your task completion rate has been ${state.complianceScore}% over the past 7 days — below the 40% threshold. This suggests the current protocol difficulty may be too high for your present circumstances. I recommend reducing the protocol intensity to a more sustainable level to rebuild consistency.`
  };
}

/**
 * Rule 4: If complianceScore > 90% and still in the first 60% of the current phase, suggest advancing early.
 */
function evaluateEarlyPhaseAdvance(ctx: AdaptationContext): TriggeredRule | null {
  const { state, enrollment } = ctx;
  if (!enrollment) return null;

  const { dayNumber, currentPhase } = enrollment;
  const { startDay, endDay } = currentPhase.dayRange;
  const phaseDuration = endDay - startDay + 1;
  const dayInPhase = dayNumber - startDay + 1;
  const phaseProgress = dayInPhase / phaseDuration;

  if (state.complianceScore <= 90) return null;
  if (phaseProgress >= 0.6) return null;

  return {
    ruleId: "early-phase-advance",
    reasoning: `You are ${state.complianceScore}% compliant and only ${Math.round(phaseProgress * 100)}% through the "${currentPhase.name}" phase (day ${dayInPhase} of ${phaseDuration}). Your strong consistency suggests you may be ready to advance to the next phase ahead of schedule.`
  };
}

/**
 * Evaluate all rules against the given context.
 * Returns only triggered rules (deterministic, pure function).
 */
export function evaluateAllRules(ctx: AdaptationContext): TriggeredRule[] {
  const rules = [
    evaluateFatigueRecoveryDay,
    evaluateOverstimulationRegulationShift,
    evaluateComplianceDifficultyReduction,
    evaluateEarlyPhaseAdvance
  ];

  const triggered: TriggeredRule[] = [];
  for (const rule of rules) {
    const result = rule(ctx);
    if (result) triggered.push(result);
  }
  return triggered;
}
