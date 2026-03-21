import type { AssessmentResult } from "@/domain/assessment/types";

export type User = {
  id: string;
  email: string;
  createdAt: string;
  lastActiveAt: string;
};

export type UserProfile = {
  userId: string;
  displayName: string;
  timezone: string;
  onboardingCompleted: boolean;
  onboardingAnswers: OnboardingResponse | null;
};

export type OnboardingResponse = {
  // Legacy onboarding fields (backward compat)
  workRhythm?: string;
  overwhelmTriggers?: string[];
  preferredTrainingWindow?: string;
  focusFrictionPatterns?: string[];
  // Assessment fields (Phase 2.1+)
  assessment?: AssessmentResult;
};
