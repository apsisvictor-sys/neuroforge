import type { AuthRepository } from "@/domain/repositories/auth-repository";
import { createId } from "@/lib/ids/create-id";
import { prisma } from "@/infrastructure/db/prisma-client";

export class PrismaAuthRepository implements AuthRepository {
  async createMagicLinkToken(userId: string, email: string, expiresAt: string): Promise<string> {
    const token = createId();
    await prisma.magicToken.create({
      data: {
        token,
        userId,
        email,
        expiresAt: new Date(expiresAt),
        consumed: false
      }
    });
    return token;
  }

  async consumeMagicLinkToken(token: string): Promise<{ userId: string; email: string } | null> {
    const candidate = await prisma.magicToken.findUnique({ where: { token } });
    if (!candidate || candidate.consumed) return null;
    if (candidate.expiresAt.getTime() < Date.now()) return null;

    await prisma.magicToken.updateMany({
      where: { token },
      data: { consumed: true }
    });

    return { userId: candidate.userId, email: candidate.email };
  }

  async createSession(userId: string, expiresAt: string): Promise<string> {
    const token = createId();
    await prisma.session.create({
      data: {
        token,
        userId,
        expiresAt: new Date(expiresAt)
      }
    });
    return token;
  }

  async getSession(sessionToken: string): Promise<{ userId: string; expiresAt: string } | null> {
    const session = await prisma.session.findUnique({ where: { token: sessionToken } });
    if (!session) return null;
    if (session.expiresAt.getTime() < Date.now()) return null;

    return { userId: session.userId, expiresAt: session.expiresAt.toISOString() };
  }

  async revokeSession(sessionToken: string): Promise<void> {
    await prisma.session.deleteMany({ where: { token: sessionToken } });
  }
}
