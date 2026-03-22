import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { DailyCheckin } from "@/domain/entities/tracking";

export type BaselineTrend = {
  metric: "focus" | "calm" | "energy";
  baseline: number;
  current: number;
  trend: "up" | "down" | "stable";
};

export type PatternInsightsDTO = {
  bestDayProfile: string;
  worstDayProfile: string;
  baselineTrends: BaselineTrend[];
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function avg(items: DailyCheckin[], key: "focus" | "calm" | "energy"): number {
  if (items.length === 0) return 0;
  return items.reduce((s, c) => s + c[key], 0) / items.length;
}

export async function getPatternInsights(params: {
  userId: string;
  trackingRepository: TrackingRepository;
  protocolRepository: ProtocolRepository;
}): Promise<PatternInsightsDTO> {
  const { userId, trackingRepository } = params;

  const checkins = await trackingRepository.getHistory(userId, 30);

  // Group by day-of-week to find best/worst days
  const byDow: Record<number, DailyCheckin[]> = {};
  for (const c of checkins) {
    const dow = new Date(c.dayKey).getDay();
    if (!byDow[dow]) byDow[dow] = [];
    byDow[dow].push(c);
  }

  let bestDow = 0, worstDow = 0;
  let bestAvg = -Infinity, worstAvg = Infinity;
  for (const [dow, cs] of Object.entries(byDow)) {
    const a = (avg(cs, "focus") + avg(cs, "calm") + avg(cs, "energy")) / 3;
    if (a > bestAvg) { bestAvg = a; bestDow = Number(dow); }
    if (a < worstAvg) { worstAvg = a; worstDow = Number(dow); }
  }

  const bestDayProfile = checkins.length >= 7
    ? `${DAY_NAMES[bestDow]}s — consistently high scores across focus, calm, and energy`
    : "Insufficient data — complete more check-ins to see your best day pattern";

  const worstDayProfile = checkins.length >= 7
    ? `${DAY_NAMES[worstDow]}s — lower composite scores; consider recovery-focused activities`
    : "Insufficient data — complete more check-ins to see your worst day pattern";

  // 30-day baseline: avg of days 15–30 vs avg of days 1–14 (rolling)
  const sorted = [...checkins].sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  const baseline = sorted.slice(0, 15);
  const current = sorted.slice(15);

  const metrics = ["focus", "calm", "energy"] as const;
  const baselineTrends: BaselineTrend[] = metrics.map((m) => {
    const b = avg(baseline, m);
    const c = avg(current.length > 0 ? current : baseline, m);
    const delta = c - b;
    const trend: "up" | "down" | "stable" =
      delta > 0.3 ? "up" : delta < -0.3 ? "down" : "stable";
    return {
      metric: m,
      baseline: Math.round(b * 10) / 10,
      current: Math.round(c * 10) / 10,
      trend,
    };
  });

  return { bestDayProfile, worstDayProfile, baselineTrends };
}
