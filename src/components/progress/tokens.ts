// Design token system for the Progress Dashboard (Phase 6.1).
// Extends the base dark-navy palette used throughout the app.

export const TP = {
  // ── Base (shared with app) ────────────────────────────────────────────────
  bgPage:       "#071220",
  bgCard:       "#0d1a2e",
  bgCardHover:  "#102240",
  bgCardDeep:   "#080f1e",
  border:       "#1e3a5f",
  borderHover:  "#2e5c8e",
  textPrimary:  "#f0f4ff",
  textSecondary:"#94a3b8",
  textMuted:    "#4a5568",

  // ── Metric accent colors ──────────────────────────────────────────────────
  metricFocus:    "#60a5fa",   // blue
  metricCalm:     "#a78bfa",   // purple
  metricEnergy:   "#fbbf24",   // amber

  metricFocusBg:  "rgba(96,165,250,0.1)",
  metricCalmBg:   "rgba(167,139,250,0.1)",
  metricEnergyBg: "rgba(251,191,36,0.1)",

  // ── Recovery score ────────────────────────────────────────────────────────
  recoveryHigh:   "#10b981",   // emerald green  (≥70)
  recoveryMid:    "#f59e0b",   // amber          (40–69)
  recoveryLow:    "#ef4444",   // red            (<40)
  recoveryBg:     "rgba(16,185,129,0.08)",
  recoveryBorder: "rgba(16,185,129,0.2)",

  // ── Streak heatmap ────────────────────────────────────────────────────────
  streakEmpty:    "rgba(30,58,95,0.5)",
  streakMissed:   "rgba(239,68,68,0.18)",
  streakLevel1:   "rgba(16,185,129,0.22)",
  streakLevel2:   "rgba(16,185,129,0.48)",
  streakLevel3:   "rgba(16,185,129,0.72)",
  streakLevel4:   "#10b981",
  streakFuture:   "rgba(30,58,95,0.25)",

  // ── Milestone celebrations ────────────────────────────────────────────────
  milestoneGold:   "#fbbf24",
  milestoneSilver: "#94a3b8",
  milestoneBg:     "rgba(251,191,36,0.07)",
  milestoneBorder: "rgba(251,191,36,0.22)",
  milestoneGlow:   "rgba(251,191,36,0.12)",

  // ── Premium lock ──────────────────────────────────────────────────────────
  premiumColor:  "#a78bfa",
  premiumBg:     "rgba(167,139,250,0.07)",
  premiumBorder: "rgba(167,139,250,0.25)",
} as const;

// ── Metric config (used in charts, summary cards) ─────────────────────────

export const METRIC_CONFIG = {
  focus:  { label: "Focus",  color: TP.metricFocus,  bg: TP.metricFocusBg  },
  calm:   { label: "Calm",   color: TP.metricCalm,   bg: TP.metricCalmBg   },
  energy: { label: "Energy", color: TP.metricEnergy, bg: TP.metricEnergyBg },
} as const;

export type MetricKey = keyof typeof METRIC_CONFIG;

// ── Milestone config ──────────────────────────────────────────────────────

export const MILESTONE_CONFIG = [
  {
    day: 7,
    label: "1 Week",
    icon: "⚡",
    title: "Neural Rewiring Begins",
    body: "After 7 days of consistent regulation practice, your prefrontal cortex begins forming new stress-response pathways.",
  },
  {
    day: 14,
    label: "2 Weeks",
    icon: "🌱",
    title: "HPA Axis Recalibration",
    body: "Two weeks of structured recovery lowers baseline cortisol. Your nervous system is learning its new set-point.",
  },
  {
    day: 30,
    label: "1 Month",
    icon: "🔥",
    title: "Autonomic Balance Shift",
    body: "30 days in: measurable improvements in heart-rate variability signal a shift toward parasympathetic dominance.",
  },
  {
    day: 56,
    label: "8 Weeks",
    icon: "🏆",
    title: "Protocol Complete",
    body: "8 weeks of the Core Reset protocol. Your nervous system baseline has fundamentally shifted. This is a new floor.",
  },
] as const;

// ── Shared data types ──────────────────────────────────────────────────────

export interface DayCheckIn {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  totalTasks: number;
  focus: number | null;
  calm: number | null;
  energy: number | null;
}

export interface WeeklyInsight {
  bestDay: string;        // e.g. "Thursday"
  topMetric: MetricKey;
  topMetricValue: number;
  improvement: MetricKey;
  improvementDelta: number; // +/- change vs prev week
  focusArea: string;      // e.g. "Morning routine consistency"
}

export interface ProgressData {
  currentDay: number;    // 1–56
  totalDays: number;     // 56
  streak: number;
  recoveryScore: number; // 0–100
  recoveryTrend: "up" | "down" | "stable";
  checkIns: DayCheckIn[];
  weeklyInsight: WeeklyInsight;
  isPremium: boolean;
}
