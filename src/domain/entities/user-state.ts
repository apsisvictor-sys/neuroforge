import type { DailyCheckin } from "@/domain/entities/tracking";
import type { DailyCompletionSummary } from "@/domain/entities/protocol";

export type ImprovementTrend = "improving" | "stable" | "regressing";

export type UserState = {
  userId: string;
  computedAt: string; // ISO date string
  nervousSystemType: string | null;
  fatigueIndex: number; // 0-1, higher = more fatigued
  complianceScore: number; // 0-100, % tasks completed in last 7 days
  resilienceScore: number; // 0-1, recovery speed after missed days
  overstimulationFlag: boolean;
  improvementTrend: ImprovementTrend;
};

export function computeUserState(
  userId: string,
  checkins: DailyCheckin[],
  completionSummaries: DailyCompletionSummary[],
  nervousSystemType: string | null
): UserState {
  // complianceScore: % of tasks completed in last 7 days
  const recent7Summaries = completionSummaries.slice(0, 7);
  const totalTasks = recent7Summaries.reduce((sum, s) => sum + s.totalCount, 0);
  const completedTasks = recent7Summaries.reduce((sum, s) => sum + s.completedCount, 0);
  const complianceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // averages from last 7 check-ins
  const recent7Checkins = checkins.slice(0, 7);
  const avgEnergy =
    recent7Checkins.length > 0
      ? recent7Checkins.reduce((sum, c) => sum + c.energy, 0) / recent7Checkins.length
      : 5;
  const avgCalm =
    recent7Checkins.length > 0
      ? recent7Checkins.reduce((sum, c) => sum + c.calm, 0) / recent7Checkins.length
      : 5;

  // fatigueIndex: 1 - ((compliance/100 + avgEnergy/10) / 2)
  const rawFatigue = 1 - (complianceScore / 100 + avgEnergy / 10) / 2;
  const fatigueIndex = Math.max(0, Math.min(1, Math.round(rawFatigue * 100) / 100));

  // overstimulationFlag: avg calm < 4 AND compliance < 50%
  const overstimulationFlag = avgCalm < 4 && complianceScore < 50;

  // resilienceScore
  const resilienceScore = computeResilienceScore(completionSummaries.slice(0, 14));

  // improvementTrend: compare recent half vs older half of check-ins
  const improvementTrend = computeImprovementTrend(checkins.slice(0, 14));

  return {
    userId,
    computedAt: new Date().toISOString(),
    nervousSystemType,
    fatigueIndex,
    complianceScore,
    resilienceScore,
    overstimulationFlag,
    improvementTrend
  };
}

function computeResilienceScore(summaries: DailyCompletionSummary[]): number {
  if (summaries.length === 0) return 1.0;

  const failedIndices: number[] = [];
  for (let i = 0; i < summaries.length; i++) {
    const s = summaries[i];
    if (s.totalCount > 0 && s.completionScore < 0.3) {
      failedIndices.push(i);
    }
  }

  if (failedIndices.length === 0) return 1.0;

  let recoveries = 0;
  let opportunities = 0;

  // summaries are DESC order (most recent first), so i-1 is the more recent day
  for (const failIdx of failedIndices) {
    if (failIdx > 0) {
      opportunities++;
      if (summaries[failIdx - 1].completionScore >= 0.5) {
        recoveries++;
      }
    }
  }

  if (opportunities === 0) return 0.5;
  return Math.round((recoveries / opportunities) * 100) / 100;
}

function computeImprovementTrend(checkins: DailyCheckin[]): ImprovementTrend {
  if (checkins.length < 4) return "stable";

  const half = Math.floor(checkins.length / 2);
  const recentHalf = checkins.slice(0, half);
  const olderHalf = checkins.slice(half);

  const avgScore = (batch: DailyCheckin[]) =>
    batch.reduce((sum, c) => sum + c.focus + c.calm + c.energy, 0) / (batch.length * 3);

  const recentAvg = avgScore(recentHalf);
  const olderAvg = avgScore(olderHalf);
  const delta = recentAvg - olderAvg;

  if (delta > 0.5) return "improving";
  if (delta < -0.5) return "regressing";
  return "stable";
}
