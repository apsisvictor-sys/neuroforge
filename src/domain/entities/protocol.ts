import type { TaskCategory } from "@/domain/types/common";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type ProtocolPillar =
  | "Dopamine Reset"
  | "Neurochemical Support"
  | "Nervous System Regulation"
  | "Behavioral Reward Rewiring"
  | "Attention & Focus";

export type ProtocolTaskDefinition = {
  id: string;
  title: string;
  instructions: string;
  category: TaskCategory;
  estimatedMinutes: number;
  order: number;
  required: boolean;
};

export type ProtocolPhase = {
  id: string;
  name: string;
  dayRange: {
    startDay: number;
    endDay: number;
  };
  tasks: ProtocolTaskDefinition[];
};

export type ProtocolTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: number;
  phases: ProtocolPhase[];
  difficulty?: DifficultyLevel;
  pillar?: ProtocolPillar;
  scientificRationale?: string;
  scienceSummary?: string;
  expectedOutcome?: string;
  prerequisites?: string[];
};

export type ProtocolCatalogItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  totalDays: number;
  phaseCount: number;
  difficulty?: DifficultyLevel;
  pillar?: ProtocolPillar;
  scienceSummary?: string;
  expectedOutcome?: string;
  prerequisites?: string[];
};

export type UserProtocolEnrollment = {
  id: string;
  userId: string;
  protocolId: string;
  startDate: string;
  active: boolean;
};

export type DailyTaskInstance = {
  id: string;
  userId: string;
  protocolId: string;
  phaseId: string;
  dayKey: string;
  taskDefinitionId: string;
  title: string;
  instructions: string;
  category: TaskCategory;
  estimatedMinutes: number;
  order: number;
  required: boolean;
  completed: boolean;
  completedAt: string | null;
};

export type DailyCompletionSummary = {
  dayKey: string;
  completedCount: number;
  totalCount: number;
  completionScore: number;
};

export type StreakState = {
  userId: string;
  currentStreak: number;
  lastQualifiedDayKey: string | null;
};
