import type { DailyCheckin } from "@/domain/entities/tracking";
import type { DailyCompletionSummary } from "@/domain/entities/protocol";

export type WeeklySummary = {
  bestDay: string;
  biggestImprovement: string;
  focusArea: string;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Computes the weekly summary from the last 7 days of check-ins and completion data.
 * - bestDay: day-of-week name with the highest composite score
 * - biggestImprovement: metric name that improved most vs first half of the window
 * - focusArea: the metric with the most room for improvement
 */
export function computeWeeklySummary(
  checkins: DailyCheckin[],
  completionSummaries: DailyCompletionSummary[]
): WeeklySummary {
  if (checkins.length === 0) {
    return {
      bestDay: "N/A",
      biggestImprovement: "More data needed",
      focusArea: "Complete daily check-ins to unlock insights",
    };
  }

  // Best day: highest average of focus + calm + energy
  let bestCheckin = checkins[0];
  let bestScore = -Infinity;
  for (const c of checkins) {
    const score = (c.focus + c.calm + c.energy) / 3;
    if (score > bestScore) {
      bestScore = score;
      bestCheckin = c;
    }
  }
  const bestDayOfWeek = DAY_NAMES[new Date(bestCheckin.dayKey).getDay()];

  // Biggest improvement: compare first half vs second half of window
  const mid = Math.floor(checkins.length / 2);
  const firstHalf = checkins.slice(0, mid);
  const secondHalf = checkins.slice(mid);

  function avg(items: DailyCheckin[], key: keyof Pick<DailyCheckin, "focus" | "calm" | "energy">): number {
    if (items.length === 0) return 0;
    return items.reduce((s, c) => s + c[key], 0) / items.length;
  }

  const metrics = ["focus", "calm", "energy"] as const;
  let bestMetric: string = "focus";
  let bestDelta = -Infinity;
  for (const m of metrics) {
    const delta = avg(secondHalf, m) - avg(firstHalf, m);
    if (delta > bestDelta) {
      bestDelta = delta;
      bestMetric = m;
    }
  }

  // Focus area: metric with most room for improvement (lowest avg in latest half)
  let worstMetric: string = "focus";
  let worstAvg = Infinity;
  for (const m of metrics) {
    const a = avg(secondHalf.length > 0 ? secondHalf : checkins, m);
    if (a < worstAvg) {
      worstAvg = a;
      worstMetric = m;
    }
  }
  const focusAreaLabels: Record<string, string> = {
    focus: "Focus",
    calm: "Calm",
    energy: "Energy",
  };

  return {
    bestDay: bestDayOfWeek,
    biggestImprovement: focusAreaLabels[bestMetric] ?? bestMetric,
    focusArea: `${focusAreaLabels[worstMetric] ?? worstMetric} — keep building on your daily practice`,
  };
}
