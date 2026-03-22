import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { UserRepository } from "@/domain/repositories/user-repository";
import { computeRecoveryScore } from "@/domain/progress/compute-recovery-score";
import { computeWeeklySummary } from "@/domain/progress/compute-weekly-summary";
import type { SubscriptionTier } from "@/domain/entities/user";

const TIER_RANK: Record<SubscriptionTier, number> = { free: 0, premium: 1, professional: 2 };
function isPremiumTier(tier: SubscriptionTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK["premium"];
}

// ── Output DTO ────────────────────────────────────────────────────────────────

export type DashboardDayCheckIn = {
  dayNumber: number;
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  focus: number | null;
  calm: number | null;
  energy: number | null;
};

export type DashboardWeeklyInsight = {
  bestDay: string;
  topMetric: "focus" | "calm" | "energy";
  topMetricValue: number;
  improvement: "focus" | "calm" | "energy";
  improvementDelta: number;
  focusArea: string;
};

export type ProgressDashboardDTO = {
  currentDay: number;
  totalDays: number;
  streak: number;
  recoveryScore: number;
  recoveryTrend: "up" | "down" | "stable";
  checkIns: DashboardDayCheckIn[];
  weeklyInsight: DashboardWeeklyInsight;
  isPremium: boolean;
};

// ── Use-case ──────────────────────────────────────────────────────────────────

export async function getProgressDashboard(params: {
  userId: string;
  trackingRepository: TrackingRepository;
  protocolRepository: ProtocolRepository;
  userRepository: UserRepository;
}): Promise<ProgressDashboardDTO | null> {
  const { userId, trackingRepository, protocolRepository, userRepository } = params;

  const enrollment = await protocolRepository.getActiveEnrollment(userId);
  if (!enrollment) return null;

  // Fetch raw data in parallel
  const [streakState, summaries56, checkins30, user] = await Promise.all([
    protocolRepository.getStreak(userId),
    protocolRepository.getDailyCompletionSummaries(userId, 56),
    trackingRepository.getHistory(userId, 30),
    userRepository.getById(userId),
  ]);

  // CTO correction #2: use total completed days (not consecutive streak) for 8-week progress
  const daysCompleted = summaries56.filter((s) => s.completionScore > 0).length;
  const currentDay = Math.min(daysCompleted + 1, 56);

  // Build a lookup map: dayKey → completionSummary
  const summaryByDay = new Map(summaries56.map((s) => [s.dayKey, s]));

  // Build checkIns array merging tracking + completion data (last 56 days)
  const startDate = new Date(enrollment.startDate);
  const checkIns: DashboardDayCheckIn[] = [];
  for (let i = 0; i < 56; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayKey = d.toISOString().slice(0, 10);
    const summary = summaryByDay.get(dayKey);
    const checkin = checkins30.find((c) => c.dayKey === dayKey);

    checkIns.push({
      dayNumber: i + 1,
      date: dayKey,
      tasksCompleted: summary?.completedCount ?? 0,
      totalTasks: summary?.totalCount ?? 0,
      focus: checkin?.focus ?? null,
      calm: checkin?.calm ?? null,
      energy: checkin?.energy ?? null,
    });
  }

  // Recovery score from last 7 days
  const last7Checkins = checkins30.slice(0, 7);
  const last7Summaries = summaries56.slice(0, 7);
  const recoveryScore = computeRecoveryScore(last7Checkins, last7Summaries);

  // Recovery trend: compare last 7 vs 8–14
  const prev7Checkins = checkins30.slice(7, 14);
  const prev7Summaries = summaries56.slice(7, 14);
  const prevScore = computeRecoveryScore(prev7Checkins, prev7Summaries);
  const scoreDelta = recoveryScore - prevScore;
  const recoveryTrend: "up" | "down" | "stable" =
    scoreDelta > 3 ? "up" : scoreDelta < -3 ? "down" : "stable";

  // Weekly summary
  const weeklySummary = computeWeeklySummary(last7Checkins, last7Summaries);

  // Determine top metric from last 7 check-ins
  function avgMetric(cs: typeof last7Checkins, key: "focus" | "calm" | "energy"): number {
    if (cs.length === 0) return 0;
    return cs.reduce((s, c) => s + c[key], 0) / cs.length;
  }
  const metrics = ["focus", "calm", "energy"] as const;
  let topMetric: "focus" | "calm" | "energy" = "focus";
  let topMetricValue = 0;
  for (const m of metrics) {
    const v = avgMetric(last7Checkins, m);
    if (v > topMetricValue) { topMetricValue = v; topMetric = m; }
  }

  // Improvement metric (highest delta vs prev 7)
  let improvement: "focus" | "calm" | "energy" = "focus";
  let bestDelta = -Infinity;
  for (const m of metrics) {
    const delta = avgMetric(last7Checkins, m) - avgMetric(prev7Checkins, m);
    if (delta > bestDelta) { bestDelta = delta; improvement = m; }
  }

  const weeklyInsight: DashboardWeeklyInsight = {
    bestDay: weeklySummary.bestDay,
    topMetric,
    topMetricValue: Math.round(topMetricValue * 10) / 10,
    improvement,
    improvementDelta: Math.round(bestDelta * 10) / 10,
    focusArea: weeklySummary.focusArea,
  };

  const isPremium = user ? isPremiumTier(user.subscriptionTier) : false;

  return {
    currentDay,
    totalDays: 56,
    streak: streakState.currentStreak,
    recoveryScore,
    recoveryTrend,
    checkIns,
    weeklyInsight,
    isPremium,
  };
}
