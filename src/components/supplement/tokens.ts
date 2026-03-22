// Design token system for supplement education module.
// Extends the ProtocolCatalogCardV2 / ProtocolBadges token set.

export const TS = {
  // ── Inherited base ────────────────────────────────────────────────────
  bgPage: "#071220",
  bgCard: "#0d1a2e",
  bgCardHover: "#102240",
  border: "#1e3a5f",
  borderHover: "#2e5c8e",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentBlue: "#3b82f6",
  accentGreen: "#10b981",

  // ── Supplement category colors ────────────────────────────────────────
  catDopamine:      { color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.25)" },
  catAdaptogen:     { color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.25)" },
  catMitochondrial: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.25)" },
  catSleep:         { color: "#818cf8", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.25)" },
  catCalming:       { color: "#67e8f9", bg: "rgba(103,232,249,0.12)", border: "rgba(103,232,249,0.25)" },

  // ── Phase alignment colors ────────────────────────────────────────────
  phaseStabilize: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)"  },
  phaseReset:     { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  phaseRebuild:   { color: "#34d399", bg: "rgba(52,211,153,0.1)"  },
  phaseOptimize:  { color: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },

  // ── Safety / warning ──────────────────────────────────────────────────
  warningBg:     "rgba(239,68,68,0.08)",
  warningBorder: "rgba(239,68,68,0.25)",
  warningText:   "#fca5a5",
  warningIcon:   "#ef4444",

  // ── Evidence levels ───────────────────────────────────────────────────
  evidenceFoundational: { color: "#10b981", label: "Foundational" },
  evidenceEmerging:     { color: "#f59e0b", label: "Emerging" },
  evidenceLimited:      { color: "#94a3b8", label: "Limited" },

  // ── Disclaimer ────────────────────────────────────────────────────────
  disclaimerBg:     "rgba(245,158,11,0.07)",
  disclaimerBorder: "rgba(245,158,11,0.2)",
  disclaimerText:   "#fcd34d",
} as const;

// ── Category config ───────────────────────────────────────────────────────

export const CATEGORY_CONFIG = {
  dopamine_precursor:     { label: "Dopamine Precursors", icon: "⬡", ...TS.catDopamine },
  adaptogen:              { label: "Adaptogens",          icon: "🌿", ...TS.catAdaptogen },
  mitochondrial_support:  { label: "Mitochondrial",       icon: "⚡", ...TS.catMitochondrial },
  sleep_support:          { label: "Sleep Support",       icon: "◗",  ...TS.catSleep },
  nervous_system_calming: { label: "Nervous System",      icon: "~",  ...TS.catCalming },
} as const;

// ── Phase config ──────────────────────────────────────────────────────────

export const PHASE_CONFIG = {
  stabilize: { label: "Stabilize", ...TS.phaseStabilize },
  reset:     { label: "Reset",     ...TS.phaseReset },
  rebuild:   { label: "Rebuild",   ...TS.phaseRebuild },
  optimize:  { label: "Optimize",  ...TS.phaseOptimize },
} as const;

export type PhaseName = keyof typeof PHASE_CONFIG;
