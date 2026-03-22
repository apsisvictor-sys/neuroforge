"use client";
import { useState } from "react";
import { TS, CATEGORY_CONFIG } from "@/components/supplement/tokens";
import { SupplementDisclaimerBanner } from "@/components/supplement/SupplementDisclaimerBanner";
import { SupplementCategoryChip } from "@/components/supplement/SupplementCategoryChip";
import { SupplementCatalogCard } from "@/components/supplement/SupplementCatalogCard";
import { SUPPLEMENTS } from "@/data/supplements";
import type { SupplementCategory } from "@/components/supplement";

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as SupplementCategory[];

export default function SupplementsPage() {
  const [activeCategory, setActiveCategory] = useState<SupplementCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? SUPPLEMENTS.filter((s) => s.status === "published")
      : SUPPLEMENTS.filter((s) => s.status === "published" && s.category === activeCategory);

  return (
    <main style={{ minHeight: "100vh", background: TS.bgPage, padding: "32px 20px", maxWidth: 1100, margin: "0 auto" }}>
      <SupplementDisclaimerBanner />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: TS.catAdaptogen.color, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
          Education
        </p>
        <h1 style={{ color: TS.textPrimary, fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          Supplement Education
        </h1>
        <p style={{ color: TS.textSecondary, fontSize: 15, margin: 0, lineHeight: 1.5 }}>
          Explore neurochemical support supplements — educational context only, not medical guidance.
        </p>
      </div>

      {/* Category filter chips */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}
        role="group"
        aria-label="Filter by category"
      >
        <SupplementCategoryChip
          category="all"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {CATEGORIES.map((cat) => (
          <SupplementCategoryChip
            key={cat}
            category={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
          <p style={{ color: TS.textSecondary, fontSize: 16, marginBottom: 16 }}>
            No supplements in this category yet
          </p>
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              background: "transparent",
              border: `1px solid ${TS.border}`,
              color: TS.textSecondary,
              padding: "8px 20px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            View all categories
          </button>
        </div>
      ) : (
        <ul
          aria-busy={false}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {filtered.map((s) => (
            <SupplementCatalogCard
              key={s.id}
              item={{
                slug: s.slug,
                name: s.name,
                category: s.category,
                mechanismSummary: s.mechanismSummary,
                phaseAlignment: s.phaseAlignment,
                hasContraindications: s.contraindications.length > 0,
                evidenceLevel: s.evidenceLevel,
              }}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
