import type { DifficultyLevel, ProtocolPillar } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";

export type ProtocolCatalogDTO = {
  items: Array<{
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    totalDays: number;
    phaseCount: number;
    difficulty?: DifficultyLevel;
    pillar?: ProtocolPillar;
    scienceSummary?: string;
    expectedOutcome?: string;
    prerequisites?: string[];
  }>;
  error: string | null;
};

export async function loadProtocolCatalog(
  protocolRepository: ProtocolRepository
): Promise<ProtocolCatalogDTO> {
  try {
    const items = await protocolRepository.listTemplateCatalog();
    return {
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        shortDescription: item.shortDescription,
        totalDays: item.totalDays,
        phaseCount: item.phaseCount,
        difficulty: item.difficulty,
        pillar: item.pillar,
        scienceSummary: item.scienceSummary,
        expectedOutcome: item.expectedOutcome,
        prerequisites: item.prerequisites
      })),
      error: null
    };
  } catch {
    return { items: [], error: "Failed to load protocol catalog." };
  }
}
