import { repositories } from "../src/infrastructure/db/repositories/index.ts";
import { prisma } from "../src/infrastructure/db/prisma-client.ts";
import { createId } from "../src/lib/ids/create-id.ts";

function dayKey(offsetDays = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function seedDemo(): Promise<void> {
  const demoEmail = "demo@neuroforge.local";

  const existingUser = await repositories.user.getByEmail(demoEmail);
  const user = existingUser ?? (await repositories.user.create(demoEmail));

  await repositories.user.upsertProfile({
    userId: user.id,
    displayName: "Demo Operator",
    timezone: "America/Los_Angeles"
  });

  const templates = await repositories.protocol.listTemplates();
  const template = templates[0];
  if (!template) {
    throw new Error("No protocol templates available for seeding");
  }

  const enrollment = await repositories.protocol.enroll(user.id, template.id, new Date().toISOString());

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

  await repositories.protocol.replaceDailyTasks(user.id, today, tasks);

  const todaysTasks = await repositories.protocol.listDailyTasks(user.id, today);
  const tasksToComplete = todaysTasks.slice(0, Math.min(3, todaysTasks.length));
  for (const task of tasksToComplete) {
    await repositories.protocol.toggleTask(task.id);
  }

  await repositories.tracking.upsertDailyCheckin({
    userId: user.id,
    dayKey: dayKey(-1),
    focus: 5,
    calm: 6,
    energy: 5,
    note: "Settling into protocol"
  });

  await repositories.tracking.upsertDailyCheckin({
    userId: user.id,
    dayKey: today,
    focus: 7,
    calm: 7,
    energy: 8,
    note: "Good focus day"
  });

  console.log("Seed complete:", {
    userId: user.id,
    email: user.email,
    protocolId: enrollment.protocolId,
    dayKey: today,
    tasksCreated: todaysTasks.length,
    tasksCompleted: tasksToComplete.length
  });

  await prisma.$disconnect();
}

seedDemo().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
