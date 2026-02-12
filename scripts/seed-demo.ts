import { createId } from "../src/lib/ids/create-id.ts";
import { getMemoryStore } from "../src/infrastructure/db/repositories/memory-store.ts";
import { protocolTemplates } from "../src/protocol-engine/definitions/templates.ts";
import type { UserRepository } from "../src/domain/repositories/user-repository.ts";
import type { ProtocolRepository } from "../src/domain/repositories/protocol-repository.ts";
import type { TrackingRepository } from "../src/domain/repositories/tracking-repository.ts";
import type { ConversationRepository } from "../src/domain/repositories/conversation-repository.ts";

function dayKey(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const userRepository: UserRepository = {
  async getByEmail(email: string) {
    return getMemoryStore().users.find((user) => user.email === email) ?? null;
  },
  async getById(userId: string) {
    return getMemoryStore().users.find((user) => user.id === userId) ?? null;
  },
  async create(email: string) {
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
  },
  async touch(userId: string) {
    const user = getMemoryStore().users.find((candidate) => candidate.id === userId);
    if (user) {
      user.lastActiveAt = new Date().toISOString();
    }
  },
  async getProfile(userId: string) {
    return getMemoryStore().profiles.find((profile) => profile.userId === userId) ?? null;
  },
  async upsertProfile(input: { userId: string; displayName: string; timezone: string }) {
    const existing = getMemoryStore().profiles.find((profile) => profile.userId === input.userId);
    if (existing) {
      existing.displayName = input.displayName;
      existing.timezone = input.timezone;
      return existing;
    }

    const created = {
      userId: input.userId,
      displayName: input.displayName,
      timezone: input.timezone,
      onboardingCompleted: false,
      onboardingAnswers: null
    };

    getMemoryStore().profiles.push(created);
    return created;
  },
  async saveOnboarding(userId, answers) {
    const profile = getMemoryStore().profiles.find((entry) => entry.userId === userId);
    if (!profile) {
      throw new Error("Profile not found");
    }
    profile.onboardingAnswers = answers;
    profile.onboardingCompleted = true;
    return profile;
  }
};

const protocolRepository: ProtocolRepository = {
  async listTemplates() {
    return protocolTemplates;
  },
  async getTemplateById(id: string) {
    return protocolTemplates.find((protocol) => protocol.id === id) ?? null;
  },
  async getTemplateBySlug(slug: string) {
    return protocolTemplates.find((protocol) => protocol.slug === slug) ?? null;
  },
  async getActiveEnrollment(userId: string) {
    return getMemoryStore().enrollments.find((item) => item.userId === userId && item.active) ?? null;
  },
  async enroll(userId: string, protocolId: string, startDate: string) {
    const existing = getMemoryStore().enrollments.find((item) => item.userId === userId && item.active);
    if (existing) {
      return existing;
    }

    const enrollment = {
      id: createId(),
      userId,
      protocolId,
      startDate,
      active: true
    };

    getMemoryStore().enrollments.push(enrollment);
    return enrollment;
  },
  async listDailyTasks(userId: string, key: string) {
    return getMemoryStore().dailyTasks
      .filter((task) => task.userId === userId && task.dayKey === key)
      .sort((a, b) => a.order - b.order);
  },
  async replaceDailyTasks(userId: string, key: string, tasks) {
    const store = getMemoryStore();
    store.dailyTasks = store.dailyTasks.filter((task) => !(task.userId === userId && task.dayKey === key));
    store.dailyTasks.push(...tasks);
  },
  async toggleTask(taskId: string) {
    const task = getMemoryStore().dailyTasks.find((entry) => entry.id === taskId);
    if (!task) {
      return null;
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    return task;
  },
  async getStreak(userId: string) {
    const existing = getMemoryStore().streaks.find((streak) => streak.userId === userId);
    if (existing) {
      return existing;
    }

    const streak = { userId, currentStreak: 0, lastQualifiedDayKey: null };
    getMemoryStore().streaks.push(streak);
    return streak;
  },
  async saveStreak(streak) {
    const store = getMemoryStore();
    const index = store.streaks.findIndex((entry) => entry.userId === streak.userId);
    if (index >= 0) {
      store.streaks[index] = streak;
      return;
    }
    store.streaks.push(streak);
  }
};

const trackingRepository: TrackingRepository = {
  async upsertDailyCheckin(input) {
    const existing = getMemoryStore().checkins.find((entry) => entry.userId === input.userId && entry.dayKey === input.dayKey);
    if (existing) {
      existing.focus = input.focus;
      existing.calm = input.calm;
      existing.energy = input.energy;
      existing.note = input.note ?? null;
      return existing;
    }

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
    return getMemoryStore().checkins
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => (a.dayKey > b.dayKey ? -1 : 1))
      .slice(0, limit);
  },
  async getLatest(userId: string) {
    const history = await this.getHistory(userId, 1);
    return history[0] ?? null;
  }
};

const conversationRepository: ConversationRepository = {
  async getOrCreateConversation(userId: string, protocolId: string) {
    const existing = getMemoryStore().conversations.find((item) => item.userId === userId && item.protocolId === protocolId);
    if (existing) {
      return existing;
    }

    const created = {
      id: createId(),
      userId,
      protocolId,
      createdAt: new Date().toISOString()
    };

    getMemoryStore().conversations.push(created);
    return created;
  },
  async listMessages(conversationId: string) {
    return getMemoryStore().messages.filter((message) => message.conversationId === conversationId);
  },
  async addMessage(input) {
    const message = {
      id: createId(),
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      createdAt: new Date().toISOString(),
      inputTokens: input.inputTokens ?? null,
      outputTokens: input.outputTokens ?? null
    };

    getMemoryStore().messages.push(message);
    return message;
  }
};

async function seedDemo(): Promise<void> {
  const demoEmail = "demo@neuroforge.local";

  const existingUser = await userRepository.getByEmail(demoEmail);
  const user = existingUser ?? (await userRepository.create(demoEmail));

  await userRepository.upsertProfile({
    userId: user.id,
    displayName: "Demo Operator",
    timezone: "America/Los_Angeles"
  });

  const templates = await protocolRepository.listTemplates();
  const template = templates[0];
  if (!template) {
    throw new Error("No protocol templates available for seeding");
  }

  const enrollment = await protocolRepository.enroll(user.id, template.id, new Date().toISOString());

  const firstPhase = template.phases[0];
  const today = dayKey(0);
  const tasks = firstPhase.tasks.map((task) => ({
    id: createId(),
    userId: user.id,
    protocolId: enrollment.protocolId,
    phaseId: firstPhase.id,
    dayKey: today,
    taskDefinitionId: task.id,
    title: task.title,
    instructions: task.instructions,
    category: task.category,
    estimatedMinutes: task.estimatedMinutes,
    order: task.order,
    required: task.required,
    completed: false,
    completedAt: null
  }));

  await protocolRepository.replaceDailyTasks(user.id, today, tasks);

  const todaysTasks = await protocolRepository.listDailyTasks(user.id, today);
  const tasksToComplete = todaysTasks.slice(0, Math.min(3, todaysTasks.length));
  for (const task of tasksToComplete) {
    await protocolRepository.toggleTask(task.id);
  }

  await trackingRepository.upsertDailyCheckin({
    userId: user.id,
    dayKey: dayKey(-1),
    focus: 5,
    calm: 6,
    energy: 5,
    note: "Settling into protocol"
  });

  await trackingRepository.upsertDailyCheckin({
    userId: user.id,
    dayKey: today,
    focus: 7,
    calm: 7,
    energy: 8,
    note: "Good focus day"
  });

  const conversation = await conversationRepository.getOrCreateConversation(user.id, enrollment.protocolId);
  await conversationRepository.addMessage({
    conversationId: conversation.id,
    role: "user",
    content: "I feel scattered this morning."
  });
  await conversationRepository.addMessage({
    conversationId: conversation.id,
    role: "assistant",
    content: "Start with your regulation task, then run one focused 25-minute sprint."
  });
  await conversationRepository.addMessage({
    conversationId: conversation.id,
    role: "user",
    content: "Done, focus improved after the sprint."
  });

  console.log("Seed complete:", {
    userId: user.id,
    email: user.email,
    protocolId: enrollment.protocolId,
    dayKey: today,
    tasksCreated: todaysTasks.length,
    tasksCompleted: tasksToComplete.length
  });
}

seedDemo().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
