"use client";
import { useState } from "react";
import Link from "next/link";
import { TS, CATEGORY_CONFIG, PHASE_CONFIG } from "./tokens";
import type { SupplementCategory, SupplementPhase, EvidenceLevel } from "@/domain/entities/supplement";
import type { PhaseName } from "./tokens";

export interface SupplementCatalogItem {
  slug: string;
  name: string;
  category: SupplementCategory;
  mechanismSummary: string;
  phaseAlignment: Array<{ phase: SupplementPhase; rationale: string }>;
  hasContraindications: boolean;
  evidenceLevel: EvidenceLevel;
}

export function SupplementCatalogCard({ item }: { item: SupplementCatalogItem }) {
  const [hovered, setHovered] = useState(false);
  const cfg = CATEGORY_CONFIG[item.category];

  return (
    <li
      style={{
        background: hovered ? TS.bgCardHover : TS.bgCard,
        border: `1px solid ${hovered ? TS.borderHover : TS.border}`,
        borderRadius: 16,
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        listStyle: "none",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${cfg.bg}` : "none",
        transition: "all 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 10px", borderRadius: 20,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          color: cfg.color, fontSize: 11, fontWeight: 700,
        }}>
          {cfg.icon} {cfg.label}
        </span>
        {item.hasContraindications && (
          <span
            aria-label="Has contraindications — read safety notes"
            title="Has contraindications"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 9px", borderRadius: 20,
              background: TS.warningBg, border: `1px solid ${TS.warningBorder}`,
              color: TS.warningText, fontSize: 11, fontWeight: 700,
            }}
          >
            ⚠ Check safety
          </span>
        )}
      </div>
      <h3 style={{ color: TS.textPrimary, fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
        {item.name}
      </h3>
      <p style={{ color: TS.textSecondary, fontSize: 13, lineHeight: 1.55, margin: 0 }}>
        {item.mechanismSummary}
      </p>
      {item.phaseAlignment.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {item.phaseAlignment.map(({ phase }) => {
            const ph = PHASE_CONFIG[phase as PhaseName];
            return (
              <span
                key={phase}
                style={{
                  padding: "2px 8px", borderRadius: 20,
                  background: ph.bg, color: ph.color,
                  fontSize: 11, fontWeight: 600,
                }}
              >
                {ph.label}
              </span>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: "auto" }}>
        <Link
          href={`/supplements/${item.slug}`}
          style={{
            display: "block", textAlign: "center",
            padding: "9px 16px", borderRadius: 10,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.color, fontWeight: 600, fontSize: 13,
            textDecoration: "none",
          }}
        >
          Learn more →
        </Link>
      </div>
    </li>
  );
}
