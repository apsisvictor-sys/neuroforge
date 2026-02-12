import type { AuthRepository } from "@/domain/repositories/auth-repository";
import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "./memory-store";

export class InMemoryAuthRepository implements AuthRepository {
  async createMagicLinkToken(userId: string, email: string, expiresAt: string): Promise<string> {
    const token = createId();
    getMemoryStore().magicTokens.push({ token, userId, email, expiresAt, consumed: false });
    return token;
  }

  async consumeMagicLinkToken(token: string): Promise<{ userId: string; email: string } | null> {
    const candidate = getMemoryStore().magicTokens.find((item) => item.token === token);
    if (!candidate || candidate.consumed) return null;
    if (new Date(candidate.expiresAt).getTime() < Date.now()) return null;

    candidate.consumed = true;
    return { userId: candidate.userId, email: candidate.email };
  }

  async createSession(userId: string, expiresAt: string): Promise<string> {
    const token = createId();
    getMemoryStore().sessions.push({ token, userId, expiresAt });
    return token;
  }

  async getSession(sessionToken: string): Promise<{ userId: string; expiresAt: string } | null> {
    const session = getMemoryStore().sessions.find((item) => item.token === sessionToken);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;

    return { userId: session.userId, expiresAt: session.expiresAt };
  }

  async revokeSession(sessionToken: string): Promise<void> {
    const store = getMemoryStore();
    store.sessions = store.sessions.filter((session) => session.token !== sessionToken);
  }
}
