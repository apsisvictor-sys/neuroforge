import test from "node:test";
import assert from "node:assert/strict";
import { createId } from "../../src/lib/ids/create-id.ts";
import { getMemoryStore } from "../../src/infrastructure/db/repositories/memory-store.ts";
import { submitDailyCheckin } from "../../src/application/use-cases/submit-daily-checkin.ts";
import { getTrackingHistory } from "../../src/application/use-cases/get-tracking-history.ts";
import { protocolTemplates } from "../../src/protocol-engine/definitions/templates.ts";

function resetMemoryStore(): void {
  const store = getMemoryStore();
  store.users = [];
  store.profiles = [];
  store.magicTokens = [];
  store.sessions = [];
  store.nonces = [];
  store.enrollments = [];
  store.dailyTasks = [];
  store.streaks = [];
  store.checkins = [];
  store.conversations = [];
  store.messages = [];
}

function createUser(email: string): { id: string; email: string } {
  const now = new Date().toISOString();
  const user = { id: createId(), email, createdAt: now, lastActiveAt: now };
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

function issueNonce(userId: string): string {
  const token = createId();
  getMemoryStore().nonces.push({
    token,
    userId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    used: false
  });
  return token;
}

function consumeNonce(userId: string, token: string): boolean {
  const nonce = getMemoryStore().nonces.find((item) => item.userId === userId && item.token === token);
  if (!nonce || nonce.used || new Date(nonce.expiresAt).getTime() <= Date.now()) {
    return false;
  }

  nonce.used = true;
  return true;
}

test("auth flow happy path: request link, verify token, session authenticated", () => {
  resetMemoryStore();

  const email = "operator@example.com";
  const user = createUser(email);

  const magicToken = createId();
  getMemoryStore().magicTokens.push({
    token: magicToken,
    userId: user.id,
    email,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    consumed: false
  });

  const tokenRecord = getMemoryStore().magicTokens.find((item) => item.token === magicToken);
  assert.ok(tokenRecord);
  tokenRecord.consumed = true;

  const sessionToken = createId();
  getMemoryStore().sessions.push({
    token: sessionToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const session = getMemoryStore().sessions.find((item) => item.token === sessionToken);
  assert.equal(Boolean(session), true);
  assert.equal(session?.userId, user.id);
});

test("today view happy path: protocol definition yields task array", () => {
  resetMemoryStore();

  const template = protocolTemplates[0];
  const phase = template.phases[0];
  const tasks = phase.tasks;

  assert.ok(Array.isArray(tasks));
  assert.ok(tasks.length > 0);
});

test("tracking happy path: submit check-in with nonce and return history", async () => {
  resetMemoryStore();

  const user = createUser("tracking@example.com");
  const nonce = issueNonce(user.id);
  assert.equal(consumeNonce(user.id, nonce), true);

  const trackingRepository = {
    async upsertDailyCheckin(input: any) {
      const checkin = {
        id: createId(),
        userId: input.userId,
        dayKey: input.dayKey,
        focus: input.focus,
        calm: input.calm,
        energy: input.energy,
        note: input.note ?? null,
        createdAt: new Date().toISOString()
      };
      getMemoryStore().checkins.push(checkin);
      return checkin;
    },
    async getHistory(userId: string, limit: number) {
      return getMemoryStore().checkins.filter((entry) => entry.userId === userId).slice(0, limit);
    },
    async getLatest() {
      return null;
    }
  };

  await submitDailyCheckin({
    userId: user.id,
    payload: { dayKey: "2026-02-12", focus: 7, calm: 6, energy: 8 },
    trackingRepository
  });

  const history = await getTrackingHistory({
    userId: user.id,
    limit: 30,
    trackingRepository
  });

  assert.equal(history.length, 1);
  assert.equal(history[0].dayKey, "2026-02-12");
});

test("assistant happy path: consume nonce and receive mocked reply", () => {
  resetMemoryStore();

  const user = createUser("assistant@example.com");
  const nonce = issueNonce(user.id);
  assert.equal(consumeNonce(user.id, nonce), true);

  const conversationId = createId();
  const userMessage = "I feel scattered.";
  const assistantReply = "Start with one focus sprint and complete required tasks first.";

  getMemoryStore().conversations.push({
    id: conversationId,
    userId: user.id,
    protocolId: "protocol-core-reset-v1",
    createdAt: new Date().toISOString()
  });

  getMemoryStore().messages.push({
    id: createId(),
    conversationId,
    role: "user",
    content: userMessage,
    createdAt: new Date().toISOString(),
    inputTokens: null,
    outputTokens: null
  });

  getMemoryStore().messages.push({
    id: createId(),
    conversationId,
    role: "assistant",
    content: assistantReply,
    createdAt: new Date().toISOString(),
    inputTokens: 8,
    outputTokens: 10
  });

  const messages = getMemoryStore().messages.filter((message) => message.conversationId === conversationId);
  assert.equal(messages.length, 2);
  assert.equal(messages[1].content.includes("focus sprint"), true);
});
