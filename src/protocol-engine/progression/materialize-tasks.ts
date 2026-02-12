import type { DailyTaskInstance, ProtocolPhase, UserProtocolEnrollment } from "@/domain/entities/protocol";
import { createId } from "@/lib/ids/create-id";

export function materializeDailyTasks(input: {
  userId: string;
  dayKey: string;
  enrollment: UserProtocolEnrollment;
  phase: ProtocolPhase;
}): DailyTaskInstance[] {
  return input.phase.tasks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((task) => ({
      id: createId(),
      userId: input.userId,
      protocolId: input.enrollment.protocolId,
      phaseId: input.phase.id,
      dayKey: input.dayKey,
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
}
