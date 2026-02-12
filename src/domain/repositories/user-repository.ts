import type { OnboardingResponse, User, UserProfile } from "@/domain/entities/user";

export interface UserRepository {
  getByEmail(email: string): Promise<User | null>;
  getById(userId: string): Promise<User | null>;
  create(email: string): Promise<User>;
  touch(userId: string): Promise<void>;
  getProfile(userId: string): Promise<UserProfile | null>;
  upsertProfile(input: { userId: string; displayName: string; timezone: string }): Promise<UserProfile>;
  saveOnboarding(userId: string, answers: OnboardingResponse): Promise<UserProfile>;
}
