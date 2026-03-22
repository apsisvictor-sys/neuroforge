import type { DifficultyLevel, ProtocolPillar } from "@/domain/entities/protocol";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { UserRepository } from "@/domain/repositories/user-repository";

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
  lockedCount: number;
  error: string | null;
};

export async function loadProtocolCatalog(
  protocolRepository: ProtocolRepository,
  options?: {
    userId?: string;
    userRepository?: Pick<UserRepository, "getById">;
    freeProtocolLimit?: number;
  }
): Promise<ProtocolCatalogDTO> {
  try {
    const allItems = await protocolRepository.listTemplateCatalog();

    let items = allItems;
    let lockedCount = 0;

    if (options?.userId && options.userRepository && options.freeProtocolLimit !== undefined) {
      const user = await options.userRepository.getById(options.userId);
      if (user?.subscriptionTier === "free") {
        lockedCount = Math.max(0, allItems.length - options.freeProtocolLimit);
        items = allItems.slice(0, options.freeProtocolLimit);
      }
    }

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
      lockedCount,
      error: null
    };
  } catch {
    return { items: [], lockedCount: 0, error: "Failed to load protocol catalog." };
  }
}
