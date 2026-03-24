/**
 * ProtocolFilterBar — Phase 3.2 Protocol Catalog filtering UI
 *
 * Filters:
 *   - Pillar (5 pillars + All)
 *   - Difficulty (All / Beginner / Intermediate / Advanced)
 *   - Duration (Any / Short ≤7d / Medium 8–21d / Long 22+d)
 *
 * Accessibility: keyboard navigable, ARIA group labels
 */

"use client";

import type { DifficultyLevel, Pillar } from "./ProtocolBadges";

export interface ProtocolFilters {
  pillar: Pillar | "All";
  difficulty: DifficultyLevel | "All";
  duration: "any" | "short" | "medium" | "long";
}

interface ProtocolFilterBarProps {
  filters: ProtocolFilters;
  onChange: (next: ProtocolFilters) => void;
  totalCount: number;
  visibleCount: number;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "#050d1a",
  bgChip: "#0d1a2e",
  bgChipActive: "#1d4ed8",
  border: "#1e3a5f",
  borderActive: "#3b82f6",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
};

const PILLARS: Array<Pillar | "All"> = [
  "All",
  "Dopamine Reset",
  "Neurochemical Support",
  "Nervous System Regulation",
  "Behavioral Reward Rewiring",
  "Attention & Focus",
];

const DIFFICULTIES: Array<DifficultyLevel | "All"> = ["All", "beginner", "intermediate", "advanced"];
const DIFFICULTY_LABELS: Record<string, string> = {
  All: "Any level",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DURATIONS = [
  { value: "any", label: "Any length" },
  { value: "short", label: "≤ 7 days" },
  { value: "medium", label: "8–21 days" },
  { value: "long", label: "22+ days" },
] as const;

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "7px 14px",
        borderRadius: 20,
        border: `1px solid ${active ? T.borderActive : T.border}`,
        background: active ? T.bgChipActive : T.bgChip,
        color: active ? "#fff" : T.textSecondary,
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── ProtocolFilterBar ────────────────────────────────────────────────────────

export function ProtocolFilterBar({
  filters,
  onChange,
  totalCount,
  visibleCount,
}: ProtocolFilterBarProps) {
  const set = (partial: Partial<ProtocolFilters>) => onChange({ ...filters, ...partial });

  return (
    <aside
      aria-label="Protocol filters"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "20px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Results count */}
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0 }}>
        Showing <strong style={{ color: T.textSecondary }}>{visibleCount}</strong> of {totalCount} protocols
      </p>

      {/* Pillar filter */}
      <div role="group" aria-label="Filter by pillar">
        <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
          Pillar
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PILLARS.map((p) => (
            <Chip
              key={p}
              label={p}
              active={filters.pillar === p}
              onClick={() => set({ pillar: p })}
            />
          ))}
        </div>
      </div>

      {/* Difficulty filter */}
      <div role="group" aria-label="Filter by difficulty">
        <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
          Difficulty
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d}
              label={DIFFICULTY_LABELS[d]}
              active={filters.difficulty === d}
              onClick={() => set({ difficulty: d })}
            />
          ))}
        </div>
      </div>

      {/* Duration filter */}
      <div role="group" aria-label="Filter by duration">
        <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
          Duration
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DURATIONS.map((d) => (
            <Chip
              key={d.value}
              label={d.label}
              active={filters.duration === d.value}
              onClick={() => set({ duration: d.value })}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Filter helper ────────────────────────────────────────────────────────────

export function applyProtocolFilters<T extends { pillar: Pillar; difficulty: DifficultyLevel; totalDays: number }>(
  items: T[],
  filters: ProtocolFilters
): T[] {
  return items.filter((item) => {
    if (filters.pillar !== "All" && item.pillar !== filters.pillar) return false;
    if (filters.difficulty !== "All" && item.difficulty !== filters.difficulty) return false;
    if (filters.duration === "short" && item.totalDays > 7) return false;
    if (filters.duration === "medium" && (item.totalDays < 8 || item.totalDays > 21)) return false;
    if (filters.duration === "long" && item.totalDays < 22) return false;
    return true;
  });
}
