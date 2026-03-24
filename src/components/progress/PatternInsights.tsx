"use client";

/**
 * PatternInsights — Premium-gated section.
 *
 * Free users see a tasteful blur + lock overlay with upgrade CTA.
 * Premium users see:
 *   - Trigger patterns (what precedes good / bad days)
 *   - Best / worst day analysis
 *   - Nervous system baseline with trend arrow
 */

import { TP, type DayCheckIn } from "./tokens";

// ── Mock analysis types (engineering will derive these from real data) ─────

interface TriggerPattern {
  trigger: string;
  effect: "positive" | "negative";
  confidence: number; // 0–1
  description: string;
}

interface BaselineTrend {
  metric: "focus" | "calm" | "energy";
  baseline: number;
  current: number;
  trend: "up" | "down" | "stable";
}

interface InsightData {
  triggerPatterns: TriggerPattern[];
  bestDayProfile: string;
  worstDayProfile: string;
  baselineTrends: BaselineTrend[];
}

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  isPremium: boolean;
  checkIns: DayCheckIn[];
  // Provided by the API when premium
  insights?: InsightData;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function TriggerRow({ pattern }: { pattern: TriggerPattern }) {
  const isPositive = pattern.effect === "positive";
  const color = isPositive ? TP.recoveryHigh : TP.recoveryLow;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 0",
        borderBottom: `1px solid ${TP.border}`,
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }} aria-hidden="true">
        {isPositive ? "✦" : "◆"}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TP.textPrimary }}>
            {pattern.trigger}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color,
              background: `${color}18`,
              padding: "2px 7px",
              borderRadius: 10,
            }}
          >
            {isPositive ? "+" : "−"}{Math.round(pattern.confidence * 100)}% likely
          </span>
        </div>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: TP.textMuted, lineHeight: 1.45 }}>
          {pattern.description}
        </p>
      </div>
    </div>
  );
}

function BaselineRow({ trend }: { trend: BaselineTrend }) {
  const metricColors: Record<string, string> = {
    focus: TP.metricFocus,
    calm:  TP.metricCalm,
    energy: TP.metricEnergy,
  };
  const color = metricColors[trend.metric] ?? TP.textSecondary;
  const arrow = trend.trend === "up" ? "↑" : trend.trend === "down" ? "↓" : "→";
  const arrowColor = trend.trend === "up" ? TP.recoveryHigh : trend.trend === "down" ? TP.recoveryLow : TP.textMuted;
  const delta = trend.current - trend.baseline;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: `1px solid ${TP.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 13, color: TP.textPrimary, textTransform: "capitalize" }}>
          {trend.metric}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: TP.textMuted }}>
          Baseline {trend.baseline.toFixed(1)} → Now {trend.current.toFixed(1)}
        </span>
        <span style={{ fontSize: 16, color: arrowColor, fontWeight: 700 }}>{arrow}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: arrowColor,
            minWidth: 36,
            textAlign: "right",
          }}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

// ── Lock overlay ───────────────────────────────────────────────────────────

function PremiumLockOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 16,
        background: "rgba(7,18,32,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        zIndex: 2,
        padding: 24,
      }}
      aria-label="Premium feature — upgrade to unlock Pattern Insights"
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: TP.premiumBg,
          border: `1px solid ${TP.premiumBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
        aria-hidden="true"
      >
        🔒
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TP.textPrimary }}>
          Pattern Insights
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: TP.textSecondary, lineHeight: 1.5, maxWidth: 260 }}>
          Discover what drives your best days and your worst. Unlock trigger analysis, nervous system baseline trends, and personalised focus areas.
        </p>
      </div>
      <a
        href="/upgrade?plan=premium&from=progress"
        style={{
          display: "inline-block",
          padding: "10px 24px",
          borderRadius: 10,
          background: TP.premiumColor,
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          marginTop: 4,
        }}
        aria-label="Upgrade to Premium to unlock Pattern Insights"
      >
        Upgrade to Premium
      </a>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

// Demo data shown blurred to free users
const DEMO_INSIGHTS: InsightData = {
  triggerPatterns: [
    {
      trigger: "Morning cold exposure",
      effect: "positive",
      confidence: 0.82,
      description: "Days starting with cold shower correlate with +1.8 focus score and better task completion.",
    },
    {
      trigger: "Late-night screen use",
      effect: "negative",
      confidence: 0.74,
      description: "Screen use after 10 PM precedes lower calm scores the following morning.",
    },
    {
      trigger: "Outdoor walk before 10am",
      effect: "positive",
      confidence: 0.68,
      description: "Morning light exposure strongly correlates with energy peaks in afternoon check-ins.",
    },
  ],
  bestDayProfile: "Tuesdays and Thursdays — consistent task completion, high focus, post-workout days",
  worstDayProfile: "Sundays — social fatigue pattern, lower energy, more incomplete tasks",
  baselineTrends: [
    { metric: "focus",  baseline: 5.2, current: 7.1, trend: "up" },
    { metric: "calm",   baseline: 4.8, current: 6.4, trend: "up" },
    { metric: "energy", baseline: 5.5, current: 6.8, trend: "up" },
  ],
};

export function PatternInsights({ isPremium, insights = DEMO_INSIGHTS }: Props) {
  const data = isPremium ? insights : DEMO_INSIGHTS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TP.textPrimary }}>
          Pattern Insights
        </h3>
        {!isPremium && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: TP.premiumColor,
              background: TP.premiumBg,
              border: `1px solid ${TP.premiumBorder}`,
              padding: "2px 8px",
              borderRadius: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Premium
          </span>
        )}
      </div>

      {/* Content wrapper with optional lock overlay */}
      <div style={{ position: "relative", borderRadius: 16 }}>
        {!isPremium && <PremiumLockOverlay />}

        <div
          style={{
            background: TP.bgCard,
            border: `1px solid ${TP.border}`,
            borderRadius: 16,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            // Blur bleed guard when locked
            overflow: "hidden",
          }}
          aria-hidden={!isPremium}
        >
          {/* Trigger patterns */}
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 11,
                fontWeight: 700,
                color: TP.textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Trigger Patterns
            </p>
            {data.triggerPatterns.map((p, i) => (
              <TriggerRow key={i} pattern={p} />
            ))}
          </div>

          {/* Day profiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.18)",
                borderRadius: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: TP.recoveryHigh, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Best Days
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: TP.textSecondary, lineHeight: 1.4 }}>
                {data.bestDayProfile}
              </p>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
              }}
            >
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: TP.recoveryLow, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Worst Days
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: TP.textSecondary, lineHeight: 1.4 }}>
                {data.worstDayProfile}
              </p>
            </div>
          </div>

          {/* Baseline trends */}
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 700,
                color: TP.textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Nervous System Baseline
            </p>
            {data.baselineTrends.map((t, i) => (
              <BaselineRow key={i} trend={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
