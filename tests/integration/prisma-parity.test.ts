import test, { after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../src/infrastructure/db/prisma-client.ts";
import type { DailyTaskInstance } from "../../src/domain/entities/protocol.ts";
import { createId } from "../../src/lib/ids/create-id.ts";

// Only run against a real DB — skip if DATABASE_URL is unset or still the placeholder value.
const hasDatabase =
  Boolean(process.env.DATABASE_URL) &&
  process.env.DATABASE_URL !== "postgresql://user:pass@localhost:5432/neuroforge";

async function resetDatabase(): Promise<void> {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.dailyTask.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.magicToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
}

after(async () => {
  if (hasDatabase) {
    await prisma.$disconnect();
  }
});

test(
  "prisma parity: user create also auto-creates profile",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    await resetDatabase();
    const userRepository = new PrismaUserRepository();

    const user = await userRepository.create("parity-user@example.com");
    const profile = await userRepository.getProfile(user.id);

    assert.equal(user.email, "parity-user@example.com");
    assert.equal(profile?.displayName, "parity-user");
    assert.equal(profile?.timezone, "UTC");
    assert.equal(profile?.onboardingCompleted, false);
    assert.equal(profile?.onboardingAnswers, null);
  }
);

test(
  "prisma parity: magic link create and consume",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    const { PrismaAuthRepository } = await import("../../src/infrastructure/db/repositories/prisma-auth-repository.ts");
    await resetDatabase();
    const userRepository = new PrismaUserRepository();
    const authRepository = new PrismaAuthRepository();

    const user = await userRepository.create("parity-auth@example.com");
    const token = await authRepository.createMagicLinkToken(
      user.id,
      user.email,
      new Date(Date.now() + 60_000).toISOString()
    );

    const consumed = await authRepository.consumeMagicLinkToken(token);
    const consumedAgain = await authRepository.consumeMagicLinkToken(token);

    assert.equal(consumed?.userId, user.id);
    assert.equal(consumed?.email, user.email);
    assert.equal(consumedAgain, null);
  }
);

test(
  "prisma parity: session create and revoke",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    const { PrismaAuthRepository } = await import("../../src/infrastructure/db/repositories/prisma-auth-repository.ts");
    await resetDatabase();
    const userRepository = new PrismaUserRepository();
    const authRepository = new PrismaAuthRepository();

    const user = await userRepository.create("parity-session@example.com");
    const token = await authRepository.createSession(
      user.id,
      new Date(Date.now() + 60_000).toISOString()
    );

    const beforeRevoke = await authRepository.getSession(token);
    await authRepository.revokeSession(token);
    const afterRevoke = await authRepository.getSession(token);

    assert.equal(beforeRevoke?.userId, user.id);
    assert.equal(afterRevoke, null);
  }
);

test(
  "prisma parity: tracking upsert and history ordering",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    const { PrismaTrackingRepository } = await import("../../src/infrastructure/db/repositories/prisma-tracking-repository.ts");
    await resetDatabase();
    const userRepository = new PrismaUserRepository();
    const trackingRepository = new PrismaTrackingRepository();

    const user = await userRepository.create("parity-tracking@example.com");

    await trackingRepository.upsertDailyCheckin({
      userId: user.id,
      dayKey: "2026-01-01",
      focus: 4,
      calm: 5,
      energy: 6
    });
    await trackingRepository.upsertDailyCheckin({
      userId: user.id,
      dayKey: "2026-01-02",
      focus: 7,
      calm: 8,
      energy: 9
    });
    await trackingRepository.upsertDailyCheckin({
      userId: user.id,
      dayKey: "2026-01-02",
      focus: 3,
      calm: 3,
      energy: 3
    });

    const history = await trackingRepository.getHistory(user.id, 10);
    assert.equal(history.length, 2);
    assert.equal(history[0].dayKey, "2026-01-02");
    assert.equal(history[0].focus, 3);
  }
);

test(
  "prisma parity: conversation create, add message, list messages",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    const { PrismaConversationRepository } = await import(
      "../../src/infrastructure/db/repositories/prisma-conversation-repository.ts"
    );
    await resetDatabase();
    const userRepository = new PrismaUserRepository();
    const conversationRepository = new PrismaConversationRepository();

    const user = await userRepository.create("parity-convo@example.com");
    const conversation = await conversationRepository.getOrCreateConversation(user.id, "protocol-core-reset-v1");

    await conversationRepository.addMessage({
      conversationId: conversation.id,
      role: "user",
      content: "first"
    });
    await conversationRepository.addMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: "second"
    });

    const messages = await conversationRepository.listMessages(conversation.id);
    assert.equal(messages.length, 2);
    assert.equal(messages[0].content, "first");
    assert.equal(messages[1].content, "second");
  }
);

test(
  "prisma parity: protocol enrollment, task replace/toggle, streak read/write",
  { skip: !hasDatabase },
  async () => {
    const { PrismaUserRepository } = await import("../../src/infrastructure/db/repositories/prisma-user-repository.ts");
    const { PrismaProtocolRepository } = await import("../../src/infrastructure/db/repositories/prisma-protocol-repository.ts");
    await resetDatabase();
    const userRepository = new PrismaUserRepository();
    const protocolRepository = new PrismaProtocolRepository();

    const user = await userRepository.create("parity-protocol@example.com");
    const enrollment = await protocolRepository.enroll(user.id, "protocol-core-reset-v1", "2026-01-01");
    const enrollmentAgain = await protocolRepository.enroll(user.id, "protocol-core-reset-v1", "2026-01-02");
    assert.equal(enrollmentAgain.id, enrollment.id);

    const tasks: DailyTaskInstance[] = [
      {
        id: createId(),
        userId: user.id,
        protocolId: "protocol-core-reset-v1",
        phaseId: "phase-1",
        dayKey: "2026-01-01",
        taskDefinitionId: "task-1",
        title: "Task 1",
        instructions: "Do task 1",
        category: "planning",
        estimatedMinutes: 10,
        order: 1,
        required: true,
        completed: false,
        completedAt: null
      }
    ];

    await protocolRepository.replaceDailyTasks(user.id, "2026-01-01", tasks);
    const listed = await protocolRepository.listDailyTasks(user.id, "2026-01-01");
    assert.equal(listed.length, 1);
    assert.equal(listed[0].title, "Task 1");

    const toggled = await protocolRepository.toggleTask(tasks[0].id);
    assert.equal(toggled?.completed, true);
    assert.equal(Boolean(toggled?.completedAt), true);

    const streak = await protocolRepository.getStreak(user.id);
    assert.equal(streak.currentStreak, 0);
    await protocolRepository.saveStreak({
      userId: user.id,
      currentStreak: 2,
      lastQualifiedDayKey: "2026-01-01"
    });
    const updated = await protocolRepository.getStreak(user.id);
    assert.equal(updated.currentStreak, 2);
    assert.equal(updated.lastQualifiedDayKey, "2026-01-01");
  }
);
