import type { UserState } from "@/domain/entities/user-state";
import type { UserStateRepository } from "@/domain/repositories/user-state-repository";
import { prisma } from "@/infrastructure/db/prisma-client";

export class PrismaUserStateRepository implements UserStateRepository {
  async getState(userId: string): Promise<UserState | null> {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { userState: true }
    });

    if (!profile || !profile.userState) return null;
    return profile.userState as UserState;
  }

  async saveState(state: UserState): Promise<void> {
    await prisma.profile.update({
      where: { userId: state.userId },
      data: { userState: state as object }
    });
  }
}
