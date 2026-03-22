"use client";

/**
 * WeeklySummaryCard — Best day, biggest improvement, focus area.
 *
 * Summarises the last 7 days of tracking data in a compact card.
 */

import { TP, METRIC_CONFIG, type WeeklyInsight } from "./tokens";

interface Props {
  insight: WeeklyInsight;
}

export function WeeklySummaryCard({ insight }: Props) {
  const topCfg = METRIC_CONFIG[insight.topMetric];
  const improveCfg = METRIC_CONFIG[insight.improvement];
  const deltaPositive = insight.improvementDelta >= 0;

  return (
    <div
      style={{
        background: TP.bgCard,
        border: `1px solid ${TP.border}`,
        borderRadius: 16,
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
      aria-label="Weekly summary"
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: TP.textPrimary,
          }}
        >
          This Week
        </h3>
        <span
          style={{
            fontSize: 10,
            color: TP.textMuted,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          7-Day Summary
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Best day */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            background: TP.bgCardDeep,
            borderRadius: 10,
            border: `1px solid ${TP.border}`,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 10, color: TP.textMuted, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Best Day
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: TP.textPrimary }}>
              {insight.bestDay}
            </p>
          </div>
          <span style={{ fontSize: 20 }} aria-hidden="true">🌟</span>
        </div>

        {/* Top metric */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            background: `${topCfg.color}0d`,
            borderRadius: 10,
            border: `1px solid ${topCfg.color}25`,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 10, color: TP.textMuted, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              Strongest Metric
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: topCfg.color }}>
              {topCfg.label}
            </p>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: topCfg.color,
            }}
          >
            {insight.topMetricValue.toFixed(1)}
          </span>
        </div>

        {/* Biggest improvement */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            background: deltaPositive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
            borderRadius: 10,
            border: `1px solid ${deltaPositive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 10, color: TP.textMuted, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {deltaPositive ? "Biggest Gain" : "Needs Attention"}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: improveCfg.color }}>
              {improveCfg.label}
            </p>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: deltaPositive ? TP.recoveryHigh : TP.recoveryLow,
            }}
          >
            {deltaPositive ? "+" : ""}
            {insight.improvementDelta.toFixed(1)}
          </span>
        </div>

        {/* Focus area */}
        <div
          style={{
            padding: "10px 12px",
            background: TP.bgCardDeep,
            borderRadius: 10,
            border: `1px solid ${TP.border}`,
          }}
        >
          <p style={{ margin: 0, fontSize: 10, color: TP.textMuted, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            This Week&apos;s Focus Area
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: TP.textSecondary, lineHeight: 1.4 }}>
            {insight.focusArea}
          </p>
        </div>
      </div>
    </div>
  );
}
