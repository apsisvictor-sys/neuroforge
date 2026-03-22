import type { ProtocolTemplate, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { UserState } from "@/domain/entities/user-state";

export type ProtocolEnrollment = UserProtocolEnrollment;

export type RecentCheckinInput = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
};

export type AssistantContext = {
  protocolId?: string;
  protocolName?: string;
  isEnrolled?: boolean;
  phaseCount?: number;
  totalDays?: number;
  todayTaskCount?: number;
  completedTaskCount?: number;
  protocolProgressPercent?: number;
  todayPhaseName?: string | null;
  todayTaskTitles: string[];
  streakCount?: number | null;
  // Phase 5.1 — enhanced context
  nervousSystemType?: string | null;
  avgFocus?: number | null;
  avgCalm?: number | null;
  avgEnergy?: number | null;
  recentCompletionRate?: number | null;
  fatigueIndex?: number | null;
  overstimulationFlag?: boolean;
  improvementTrend?: string | null;
};

export function buildAssistantContext(input: {
  protocolTemplate?: ProtocolTemplate;
  enrollment?: ProtocolEnrollment;
  todayTasks?: { title: string; completed?: boolean }[];
  todayPhaseName?: string | null;
  currentDay?: number;
  streak?: number | null;
  nervousSystemType?: string | null;
  recentCheckins?: RecentCheckinInput[];
  recentCompletionRate?: number | null;
  userState?: UserState | null;
}): AssistantContext {
  const totalDays = input.protocolTemplate?.phases.reduce((maxDays, phase) => {
    return Math.max(maxDays, phase.dayRange.endDay);
  }, 0);
  const todayTaskCount = typeof input.todayTasks === "undefined" ? undefined : input.todayTasks.length;
  const completedTaskCount =
    typeof input.todayTasks === "undefined"
      ? undefined
      : input.todayTasks.filter((task) => task.completed === true).length;
  const protocolProgressPercent =
    typeof totalDays === "number" && typeof input.currentDay === "number" && totalDays > 0
      ? Math.round((input.currentDay / totalDays) * 100)
      : undefined;

  // Compute check-in averages
  let avgFocus: number | null = null;
  let avgCalm: number | null = null;
  let avgEnergy: number | null = null;
  if (input.recentCheckins && input.recentCheckins.length > 0) {
    const n = input.recentCheckins.length;
    avgFocus = Math.round((input.recentCheckins.reduce((s, c) => s + c.focus, 0) / n) * 10) / 10;
    avgCalm = Math.round((input.recentCheckins.reduce((s, c) => s + c.calm, 0) / n) * 10) / 10;
    avgEnergy = Math.round((input.recentCheckins.reduce((s, c) => s + c.energy, 0) / n) * 10) / 10;
  }

  return {
    protocolId: input.protocolTemplate?.id ?? input.enrollment?.protocolId,
    protocolName: input.protocolTemplate?.name,
    isEnrolled: typeof input.enrollment === "undefined" ? undefined : input.enrollment.active,
    phaseCount: input.protocolTemplate?.phases.length,
    totalDays,
    todayTaskCount,
    completedTaskCount,
    protocolProgressPercent,
    todayPhaseName: input.todayPhaseName ?? null,
    todayTaskTitles: (input.todayTasks ?? []).map((task) => task.title),
    streakCount: input.streak ?? null,
    nervousSystemType: input.nervousSystemType ?? null,
    avgFocus,
    avgCalm,
    avgEnergy,
    recentCompletionRate: input.recentCompletionRate ?? null,
    fatigueIndex: input.userState?.fatigueIndex ?? null,
    overstimulationFlag: input.userState?.overstimulationFlag,
    improvementTrend: input.userState?.improvementTrend ?? null
  };
}
