import type { DailyCheckin } from "@/domain/entities/tracking";
import type { DailyCompletionSummary } from "@/domain/entities/protocol";

/**
 * Recovery Score (0–100): composite of check-in scores + completion rate.
 * Distinct from ResilienceScore (user-state.ts) which measures recovery-from-failure patterns.
 *
 * Formula: (avg check-in score × 60%) + (avg completion rate × 40%)
 * - Check-in score per day = (focus + calm + energy) / 3 / 5 × 100  (scores are 1–5)
 * - Completion rate = completionScore (0–1) × 100
 */
export function computeRecoveryScore(
  checkins: DailyCheckin[],
  completionSummaries: DailyCompletionSummary[]
): number {
  const checkInScore =
    checkins.length === 0
      ? 0
      : checkins.reduce((sum, c) => {
          const dayScore = ((c.focus + c.calm + c.energy) / 3 / 5) * 100;
          return sum + dayScore;
        }, 0) / checkins.length;

  const completionRate =
    completionSummaries.length === 0
      ? 0
      : (completionSummaries.reduce((sum, s) => sum + s.completionScore, 0) /
          completionSummaries.length) *
        100;

  return Math.round(checkInScore * 0.6 + completionRate * 0.4);
}
