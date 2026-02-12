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
  workRhythm: string;
  overwhelmTriggers: string[];
  preferredTrainingWindow: string;
  focusFrictionPatterns: string[];
};
