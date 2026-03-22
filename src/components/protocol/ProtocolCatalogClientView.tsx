"use client";

/**
 * ProtocolCatalogClientView — Phase 3.2
 *
 * Client wrapper that manages filter state and renders the enhanced
 * protocol catalog with ProtocolFilterBar + ProtocolCatalogCardV2.
 */

import { useState } from "react";
import type { ProtocolCatalogDTO } from "@/application/protocol/load-protocol-catalog";
import { ProtocolFilterBar, applyProtocolFilters } from "@/components/protocol/ProtocolFilterBar";
import { ProtocolCatalogCardV2 } from "@/components/protocol/ProtocolCatalogCardV2";
import type { ProtocolFilters } from "@/components/protocol/ProtocolFilterBar";
import type { ProtocolCatalogItemV2 } from "@/components/protocol/ProtocolCatalogCardV2";
import type { DifficultyLevel, ProtocolPillar } from "@/domain/entities/protocol";

type CatalogItem = ProtocolCatalogDTO["items"][number];

function toV2Item(item: CatalogItem): ProtocolCatalogItemV2 {
  return {
    slug: item.slug,
    title: item.title,
    shortDescription: item.shortDescription,
    totalDays: item.totalDays,
    phaseCount: item.phaseCount,
    difficulty: (item.difficulty ?? "beginner") as DifficultyLevel,
    pillar: (item.pillar ?? "Nervous System Regulation") as ProtocolPillar,
    scienceSummary: item.scienceSummary,
    isLocked: false, // Phase 4.3: will wire from user tier
    prerequisiteSlug: item.prerequisites?.[0],
  };
}

const DEFAULT_FILTERS: ProtocolFilters = {
  pillar: "All",
  difficulty: "All",
  duration: "any",
};

export function ProtocolCatalogClientView({
  items,
  error,
}: {
  items: CatalogItem[];
  error: string | null;
}) {
  const [filters, setFilters] = useState<ProtocolFilters>(DEFAULT_FILTERS);

  if (error) {
    return (
      <section className="protocol-catalog-error">
        <p>{error}</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="protocol-catalog-empty">
        No protocols available
      </section>
    );
  }

  const v2Items = items.map(toV2Item);
  const filtered = applyProtocolFilters(v2Items, filters);

  return (
    <div>
      <ProtocolFilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={v2Items.length}
        visibleCount={filtered.length}
      />
      {filtered.length === 0 ? (
        <section className="protocol-catalog-empty" style={{ marginTop: 32 }}>
          No protocols match the selected filters.
        </section>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "grid", gap: 16 }}>
          {filtered.map((item) => (
            <ProtocolCatalogCardV2 key={item.slug} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
