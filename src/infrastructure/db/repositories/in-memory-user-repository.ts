import type { OnboardingResponse, User, UserProfile } from "@/domain/entities/user";
import type { AssessmentResult } from "@/domain/assessment/types";
import type { UserRepository } from "@/domain/repositories/user-repository";
import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "./memory-store";

export class InMemoryUserRepository implements UserRepository {
  async getByEmail(email: string): Promise<User | null> {
    return getMemoryStore().users.find((user) => user.email === email) ?? null;
  }

  async getById(userId: string): Promise<User | null> {
    return getMemoryStore().users.find((user) => user.id === userId) ?? null;
  }

  async create(email: string): Promise<User> {
    const now = new Date().toISOString();
    const user: User = { id: createId(), email, createdAt: now, lastActiveAt: now };
    getMemoryStore().users.push(user);
    getMemoryStore().profiles.push({
      userId: user.id,
      displayName: email.split("@")[0],
      timezone: "UTC",
      onboardingCompleted: false,
      onboardingAnswers: null
    });
    return user;
  }

  async touch(userId: string): Promise<void> {
    const user = getMemoryStore().users.find((candidate) => candidate.id === userId);
    if (user) user.lastActiveAt = new Date().toISOString();
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    return getMemoryStore().profiles.find((profile) => profile.userId === userId) ?? null;
  }

  async upsertProfile(input: { userId: string; displayName: string; timezone: string }): Promise<UserProfile> {
    const existing = getMemoryStore().profiles.find((profile) => profile.userId === input.userId);
    if (existing) {
      existing.displayName = input.displayName;
      existing.timezone = input.timezone;
      return existing;
    }

    const created: UserProfile = {
      userId: input.userId,
      displayName: input.displayName,
      timezone: input.timezone,
      onboardingCompleted: false,
      onboardingAnswers: null
    };

    getMemoryStore().profiles.push(created);
    return created;
  }

  async saveOnboarding(userId: string, answers: OnboardingResponse): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    profile.onboardingAnswers = answers;
    profile.onboardingCompleted = true;
    return profile;
  }

  async saveAssessment(userId: string, result: AssessmentResult): Promise<UserProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    profile.onboardingAnswers = { ...profile.onboardingAnswers, assessment: result };
    return profile;
  }
}
