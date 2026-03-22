"use client";
import { useState } from "react";
import { TS, PHASE_CONFIG } from "@/components/supplement/tokens";
import { SupplementDisclaimerBanner } from "@/components/supplement/SupplementDisclaimerBanner";
import { SupplementStackItem } from "@/components/supplement/SupplementStackItem";
import { PHASE_STACKS, getSupplementById } from "@/data/supplements";
import type { SupplementPhase } from "@/components/supplement";
import type { PhaseName } from "@/components/supplement/tokens";

const PHASES: { key: SupplementPhase; focus: string }[] = [
  { key: "stabilize", focus: "Nervous system settling and safety baseline" },
  { key: "reset",     focus: "Reward pathway support and habit transition" },
  { key: "rebuild",   focus: "Energy and metabolic recovery support" },
  { key: "optimize",  focus: "Performance stability and resilience" },
];

export default function SupplementStacksPage() {
  const [activePhase, setActivePhase] = useState<SupplementPhase>("stabilize");

  const stack = PHASE_STACKS.find((s) => s.phase === activePhase);

  return (
    <main style={{ minHeight: "100vh", background: TS.bgPage, padding: "32px 20px", maxWidth: 800, margin: "0 auto" }}>
      <SupplementDisclaimerBanner />

      <div style={{ marginBottom: 32 }}>
        <p style={{ color: TS.catAdaptogen.color, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>
          Phase Stacks
        </p>
        <h1 style={{ color: TS.textPrimary, fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          Protocol Phase Supplement Stacks
        </h1>
        <p style={{ color: TS.textSecondary, fontSize: 15, margin: 0, lineHeight: 1.5 }}>
          Educational context for supplement support aligned to each protocol phase — not prescriptive recommendations.
        </p>
      </div>

      {/* Phase tab bar */}
      <div
        role="tablist"
        aria-label="Protocol phases"
        style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}
      >
        {PHASES.map(({ key }) => {
          const ph = PHASE_CONFIG[key as PhaseName];
          const isActive = activePhase === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActivePhase(key)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: isActive ? `2px solid ${ph.color}` : `1px solid ${TS.border}`,
                background: isActive ? ph.bg : "transparent",
                color: isActive ? ph.color : TS.textSecondary,
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {ph.label}
            </button>
          );
        })}
      </div>

      {/* Active phase content */}
      {stack && (
        <>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: PHASE_CONFIG[activePhase as PhaseName].color, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
              {PHASE_CONFIG[activePhase as PhaseName].label} Phase
            </h2>
            <p style={{ color: TS.textSecondary, fontSize: 14, margin: 0 }}>
              Focus: {stack.focus}
            </p>
          </div>
          <div role="tabpanel">
            {stack.entries.map((entry) => {
              const supp = getSupplementById(entry.supplementId);
              if (!supp || supp.status !== "published") return null;
              return (
                <SupplementStackItem
                  key={entry.supplementId}
                  supplement={{ slug: supp.slug, name: supp.name, category: supp.category }}
                  rationale={entry.rationale}
                />
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
