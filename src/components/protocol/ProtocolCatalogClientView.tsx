"use client";

/**
 * ProtocolCatalogClientView — Phase 3.2 / Phase 4.3
 *
 * Client wrapper that manages filter state and renders the enhanced
 * protocol catalog with ProtocolFilterBar + ProtocolCatalogCardV2.
 * Phase 4.3: shows locked placeholder cards for Free-tier users.
 */

import { useState } from "react";
import type { ProtocolCatalogDTO } from "@/application/protocol/load-protocol-catalog";
import { ProtocolFilterBar, applyProtocolFilters } from "@/components/protocol/ProtocolFilterBar";
import { ProtocolCatalogCardV2 } from "@/components/protocol/ProtocolCatalogCardV2";
import { UpgradeModal } from "@/components/pricing/UpgradeModal";
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
    isLocked: false,
    prerequisiteSlug: item.prerequisites?.[0],
  };
}

function makeLockedPlaceholder(index: number): ProtocolCatalogItemV2 {
  return {
    slug: `locked-${index}`,
    title: "Premium Protocol",
    shortDescription: "Unlock this protocol by upgrading to Premium.",
    totalDays: 30,
    phaseCount: 2,
    difficulty: "intermediate" as DifficultyLevel,
    pillar: "Nervous System Regulation" as ProtocolPillar,
    isLocked: true,
  };
}

const DEFAULT_FILTERS: ProtocolFilters = {
  pillar: "All",
  difficulty: "All",
  duration: "any",
};

export function ProtocolCatalogClientView({
  items,
  lockedCount = 0,
  error,
}: {
  items: CatalogItem[];
  lockedCount?: number;
  error: string | null;
}) {
  const [filters, setFilters] = useState<ProtocolFilters>(DEFAULT_FILTERS);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (error) {
    return (
      <section className="protocol-catalog-error">
        <p>{error}</p>
      </section>
    );
  }

  if (items.length === 0 && lockedCount === 0) {
    return (
      <section className="protocol-catalog-empty">
        No protocols available
      </section>
    );
  }

  const v2Items = items.map(toV2Item);
  const filtered = applyProtocolFilters(v2Items, filters);
  const lockedPlaceholders = Array.from({ length: lockedCount }, (_, i) => makeLockedPlaceholder(i));

  return (
    <div>
      <ProtocolFilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={v2Items.length + lockedCount}
        visibleCount={filtered.length}
      />
      {filtered.length === 0 && lockedCount === 0 ? (
        <section className="protocol-catalog-empty" style={{ marginTop: 32 }}>
          No protocols match the selected filters.
        </section>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "grid", gap: 16 }}>
          {filtered.map((item) => (
            <ProtocolCatalogCardV2 key={item.slug} item={item} />
          ))}
          {lockedPlaceholders.map((item, i) => (
            <ProtocolCatalogCardV2
              key={item.slug}
              item={item}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          ))}
        </ul>
      )}

      {/* Upgrade CTA below locked cards */}
      {lockedCount > 0 && (
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 32 }}>
          <a
            href="/pricing"
            style={{
              color: "#3b82f6",
              fontSize: 14,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Upgrade to Premium to unlock {lockedCount} more protocol{lockedCount !== 1 ? "s" : ""} →
          </a>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={(plan) => {
          window.location.href = `/pricing?plan=${plan}`;
        }}
      />
    </div>
  );
}
