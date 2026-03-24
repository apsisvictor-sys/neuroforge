/**
 * Protocol metadata badge components — Phase 3.2 Design System
 *
 * Usage:
 *   <DifficultyBadge level="intermediate" />
 *   <PillarBadge pillar="Dopamine Reset" />
 *   <DurationBadge days={21} />
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type Pillar =
  | "Dopamine Reset"
  | "Neurochemical Support"
  | "Nervous System Regulation"
  | "Behavioral Reward Rewiring"
  | "Attention & Focus";

// ─── Design tokens (shared, no Tailwind) ─────────────────────────────────────

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  intermediate: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  advanced: { label: "Advanced", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const PILLAR_CONFIG: Record<Pillar, { color: string; bg: string; abbr: string }> = {
  "Dopamine Reset": { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", abbr: "DR" },
  "Neurochemical Support": { color: "#34d399", bg: "rgba(52,211,153,0.12)", abbr: "NC" },
  "Nervous System Regulation": { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", abbr: "NS" },
  "Behavioral Reward Rewiring": { color: "#f97316", bg: "rgba(249,115,22,0.12)", abbr: "BR" },
  "Attention & Focus": { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", abbr: "AF" },
};

const baseBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

// ─── DifficultyBadge ─────────────────────────────────────────────────────────

export function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const config = DIFFICULTY_CONFIG[level];
  return (
    <span
      style={{
        ...baseBadgeStyle,
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
      }}
      aria-label={`Difficulty: ${config.label}`}
    >
      <span aria-hidden="true">◆</span>
      {config.label}
    </span>
  );
}

// ─── PillarBadge ─────────────────────────────────────────────────────────────

export function PillarBadge({ pillar }: { pillar: Pillar }) {
  const config = PILLAR_CONFIG[pillar];
  return (
    <span
      style={{
        ...baseBadgeStyle,
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
      }}
      title={pillar}
      aria-label={`Pillar: ${pillar}`}
    >
      {pillar}
    </span>
  );
}

// ─── DurationBadge ───────────────────────────────────────────────────────────

export function DurationBadge({ days }: { days: number }) {
  return (
    <span
      style={{
        ...baseBadgeStyle,
        color: "#94a3b8",
        background: "rgba(148,163,184,0.1)",
        border: "1px solid rgba(148,163,184,0.15)",
      }}
      aria-label={`Duration: ${days} days`}
    >
      <span aria-hidden="true">🕐</span>
      {days}d
    </span>
  );
}

// ─── ProtocolBadgeGroup (convenience) ────────────────────────────────────────

interface ProtocolBadgeGroupProps {
  difficulty: DifficultyLevel;
  pillar: Pillar;
  days: number;
}

export function ProtocolBadgeGroup({ difficulty, pillar, days }: ProtocolBadgeGroupProps) {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
      role="group"
      aria-label="Protocol metadata"
    >
      <DifficultyBadge level={difficulty} />
      <PillarBadge pillar={pillar} />
      <DurationBadge days={days} />
    </div>
  );
}
