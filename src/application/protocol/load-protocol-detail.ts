import type { DifficultyLevel, ProtocolPillar } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";

export type ProtocolDetailDTO =
  | { status: "missing-slug" }
  | { status: "not-found" }
  | {
      status: "ok";
      template: {
        id: string;
        name: string;
        description: string;
        difficulty?: DifficultyLevel;
        pillar?: ProtocolPillar;
        scientificRationale?: string;
        expectedOutcome?: string;
        phases: {
          id: string;
          name: string;
          dayRange: { startDay: number; endDay: number };
          tasks: {
            id: string;
            title: string;
          }[];
        }[];
      };
      isEnrolledInThisProtocol: boolean;
    };

export async function loadProtocolDetail(
  slug: string | undefined,
  userId: string,
  protocolRepository: ProtocolRepository
): Promise<ProtocolDetailDTO> {
  if (!slug || !slug.trim()) {
    return { status: "missing-slug" };
  }

  const template = await protocolRepository.getTemplateBySlug(slug.trim());
  if (!template) {
    return { status: "not-found" };
  }

  const activeEnrollment = await protocolRepository.getActiveEnrollment(userId);

  return {
    status: "ok",
    template: {
      id: template.id,
      name: template.name,
      description: template.description,
      difficulty: template.difficulty,
      pillar: template.pillar,
      scientificRationale: template.scientificRationale,
      expectedOutcome: template.expectedOutcome,
      phases: template.phases.map((phase) => ({
        id: phase.id,
        name: phase.name,
        dayRange: {
          startDay: phase.dayRange.startDay,
          endDay: phase.dayRange.endDay
        },
        tasks: phase.tasks.map((task) => ({
          id: task.id,
          title: task.title
        }))
      }))
    },
    isEnrolledInThisProtocol: activeEnrollment?.protocolId === template.id
  };
}
