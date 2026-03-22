"use client";

/**
 * ProgressDashboard — Phase 6.1 progress visualization dashboard.
 *
 * Fetches from GET /api/progress/dashboard.
 *
 * Layout:
 *   ① Hero row:   Recovery score + 8-week progress bar
 *   ② Streak:     Heatmap calendar (full width)
 *   ③ Charts:     Metric trend charts (focus / calm / energy)
 *   ④ Milestones: Day 7 / 14 / 30 / 56 celebration cards
 *   ⑤ Bottom row: Weekly summary + Pattern Insights (Premium)
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TP, type ProgressData } from "./tokens";
import { StreakCalendar } from "./StreakCalendar";
import { ProgressBar8Week } from "./ProgressBar8Week";
import { RecoveryScore } from "./RecoveryScore";
import { MilestoneCelebrations } from "./MilestoneCard";
import { WeeklySummaryCard } from "./WeeklySummaryCard";
import { PatternInsights } from "./PatternInsights";
import { getJson } from "@/ui/hooks/use-api";

// CTO correction: lazy-load the chart component to keep initial bundle lean
const MetricTrendChart = dynamic(() => import("./MetricTrendChart").then((m) => ({ default: m.MetricTrendChart })), {
  ssr: false,
});

// ── Card container helper ──────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: TP.bgCard,
        border: `1px solid ${TP.border}`,
        borderRadius: 16,
        padding: "20px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Section label helper ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 12px",
        fontSize: 11,
        fontWeight: 700,
        color: TP.textMuted,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

// ── ProgressDashboard ──────────────────────────────────────────────────────

export function ProgressDashboard() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ dashboard: ProgressData | null }>("/api/progress/dashboard")
      .then((res) => {
        setData(res.dashboard);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load progress");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          color: TP.textMuted,
          fontSize: 14,
          padding: "60px 0",
          textAlign: "center",
        }}
      >
        Loading your progress…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ color: TP.recoveryLow, fontSize: 14, padding: "40px 0", textAlign: "center" }}>
        {error ?? "No active protocol — enroll in a protocol to track your progress."}
      </div>
    );
  }

  // Last 30 days of check-ins for the charts
  const last30 = data.checkIns.filter((c) => c.focus !== null || c.calm !== null || c.energy !== null).slice(-30);

  return (
    <div
      style={{
        color: TP.textPrimary,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* ── ① Hero row: Recovery Score + 8-Week Progress ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* Recovery Score gauge */}
        <Card
          style={{
            background: TP.recoveryBg,
            border: `1px solid ${TP.recoveryBorder}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 24px",
          }}
        >
          <SectionLabel>Recovery Score</SectionLabel>
          <RecoveryScore
            score={data.recoveryScore}
            trend={data.recoveryTrend}
            trendDelta={5}
          />
        </Card>

        {/* 8-Week Progress */}
        <Card>
          <SectionLabel>8-Week Journey</SectionLabel>
          <ProgressBar8Week currentDay={data.currentDay} totalDays={data.totalDays} />

          {/* Streak badge */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }} aria-hidden="true">🔥</span>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: TP.milestoneGold }}>
                {data.streak}
              </span>
              <span style={{ fontSize: 13, color: TP.textMuted, marginLeft: 5 }}>
                day streak
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── ② Streak Calendar ─────────────────────────────────────────────── */}
      <Card>
        <SectionLabel>Daily Completion — 56 Days</SectionLabel>
        <StreakCalendar checkIns={data.checkIns} currentDay={data.currentDay} totalDays={data.totalDays} />
      </Card>

      {/* ── ③ Metric Trend Charts ──────────────────────────────────────────── */}
      {last30.length >= 3 ? (
        <Card>
          <SectionLabel>Metric Trends</SectionLabel>
          <MetricTrendChart checkIns={last30} />
        </Card>
      ) : (
        <Card>
          <SectionLabel>Metric Trends</SectionLabel>
          <p style={{ color: TP.textMuted, fontSize: 13, margin: 0, padding: "20px 0" }}>
            Complete 3+ daily check-ins to see your trend charts.
          </p>
        </Card>
      )}

      {/* ── ④ Milestones ────────────────────────────────────────────────────── */}
      <MilestoneCelebrations currentDay={data.currentDay} />

      {/* ── ⑤ Bottom: Weekly Summary + Pattern Insights ─────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <WeeklySummaryCard insight={data.weeklyInsight} />
        <PatternInsights isPremium={data.isPremium} checkIns={data.checkIns} />
      </div>
    </div>
  );
}
