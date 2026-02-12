import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";

export type TaskToggleDTO = {
  id: string;
  completed: boolean;
  completedAt: string | null;
};

export async function toggleTask(input: {
  taskId: string;
  protocolRepository: ProtocolRepository;
}): Promise<TaskToggleDTO> {
  const task = await input.protocolRepository.toggleTask(input.taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  return {
    id: task.id,
    completed: task.completed,
    completedAt: task.completedAt
  };
}
