import type { ProtocolTemplate, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { UserState } from "@/domain/entities/user-state";

export type RecentCheckin = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
};

export type AssistantContextInput = {
  protocolTemplate?: ProtocolTemplate;
  enrollment?: UserProtocolEnrollment;
  todayTasks?: { title: string; completed?: boolean }[];
  todayPhaseName?: string | null;
  currentDay?: number;
  streak?: number | null;
  // Phase 5.1 — enhanced context
  nervousSystemType?: string | null;
  recentCheckins?: RecentCheckin[];
  recentCompletionRate?: number | null;
  userState?: UserState | null;
};
