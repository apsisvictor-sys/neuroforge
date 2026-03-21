import type { OnboardingResponse, User, UserProfile } from "@/domain/entities/user";
import type { UserRepository } from "@/domain/repositories/user-repository";
import type { AssessmentResult } from "@/domain/assessment/types";
import { prisma } from "@/infrastructure/db/prisma-client";
import { Prisma } from "@prisma/client";

function mapUser(row: { id: string; email: string; createdAt: Date; lastActiveAt: Date }): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
    lastActiveAt: row.lastActiveAt.toISOString()
  };
}

function mapProfile(row: {
  userId: string;
  displayName: string;
  timezone: string;
  onboardingCompleted: boolean;
  onboardingAnswers: Prisma.JsonValue | null;
}): UserProfile {
  return {
    userId: row.userId,
    displayName: row.displayName,
    timezone: row.timezone,
    onboardingCompleted: row.onboardingCompleted,
    onboardingAnswers: row.onboardingAnswers as OnboardingResponse | null
  };
}

export class PrismaUserRepository implements UserRepository {
  async getByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? mapUser(row) : null;
  }

  async getById(userId: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id: userId } });
    return row ? mapUser(row) : null;
  }

  async create(email: string): Promise<User> {
    const now = new Date();
    const row = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          createdAt: now,
          lastActiveAt: now
        }
      });

      await tx.profile.create({
        data: {
          userId: created.id,
          displayName: email.split("@")[0],
          timezone: "UTC",
          onboardingCompleted: false,
          onboardingAnswers: null as any
        }
      });

      return created;
    });

    return mapUser(row);
  }

  async touch(userId: string): Promise<void> {
    await prisma.user.updateMany({
      where: { id: userId },
      data: { lastActiveAt: new Date() }
    });
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const row = await prisma.profile.findUnique({ where: { userId } });
    return row ? mapProfile(row) : null;
  }

  async upsertProfile(input: { userId: string; displayName: string; timezone: string }): Promise<UserProfile> {
    const row = await prisma.profile.upsert({
      where: { userId: input.userId },
      update: {
        displayName: input.displayName,
        timezone: input.timezone
      },
      create: {
        userId: input.userId,
        displayName: input.displayName,
        timezone: input.timezone,
        onboardingCompleted: false,
        onboardingAnswers: null as any
      }
    });

    return mapProfile(row);
  }

  async saveOnboarding(userId: string, answers: OnboardingResponse): Promise<UserProfile> {
    try {
      const row = await prisma.profile.update({
        where: { userId },
        data: {
          onboardingAnswers: answers,
          onboardingCompleted: true
        }
      });

      return mapProfile(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Profile not found");
      }

      throw error;
    }
  }

  async saveAssessment(userId: string, result: AssessmentResult): Promise<UserProfile> {
    try {
      // Merge assessment into existing onboardingAnswers (preserves legacy fields)
      const existing = await prisma.profile.findUnique({ where: { userId } });
      const current = (existing?.onboardingAnswers ?? {}) as Record<string, unknown>;

      const row = await prisma.profile.update({
        where: { userId },
        data: {
          onboardingAnswers: { ...current, assessment: result as unknown as Prisma.JsonValue },
        },
      });

      return mapProfile(row);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Profile not found");
      }
      throw error;
    }
  }
}
