import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "@/infrastructure/db/repositories/memory-store";

const NONCE_TTL_MS = 10 * 60 * 1000;

function prune(now: number): void {
  const store = getMemoryStore();
  store.nonces = store.nonces.filter((nonce) => !nonce.used && new Date(nonce.expiresAt).getTime() > now);
}

export function issueNonce(userId: string): string {
  const now = Date.now();
  prune(now);

  const token = createId();
  getMemoryStore().nonces.push({
    token,
    userId,
    expiresAt: new Date(now + NONCE_TTL_MS).toISOString(),
    used: false
  });

  return token;
}

export function consumeNonce(userId: string, token: string): boolean {
  const now = Date.now();
  prune(now);

  const nonce = getMemoryStore().nonces.find((candidate) => candidate.token === token && candidate.userId === userId);
  if (!nonce || nonce.used) {
    return false;
  }

  nonce.used = true;
  return true;
}
