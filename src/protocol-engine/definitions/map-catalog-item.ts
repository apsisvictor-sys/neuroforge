import type { ProtocolCatalogItem, ProtocolTemplate } from "@/domain/entities/protocol";

export function toProtocolCatalogItem(
  template: ProtocolTemplate
): ProtocolCatalogItem & { firstPhaseName: string } {
  const totalDays = template.phases.reduce((maxDays, phase) => {
    return Math.max(maxDays, phase.dayRange.endDay);
  }, 0);

  return {
    id: template.id,
    slug: template.slug,
    title: template.name,
    shortDescription: template.description,
    totalDays,
    phaseCount: template.phases.length,
    firstPhaseName: template.phases[0]?.name ?? "—"
  };
}
