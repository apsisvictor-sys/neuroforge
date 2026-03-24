"use client";

/**
 * RecoveryScore — Composite nervous system recovery metric display.
 *
 * Large circular gauge (SVG arc) with:
 * - Score 0–100 displayed in center
 * - Color: red (<40) / amber (40–69) / green (≥70)
 * - Trend arrow (up/down/stable) with % change
 * - Short label explaining the score composition
 */

import { TP } from "./tokens";

interface Props {
  score: number;                            // 0–100
  trend: "up" | "down" | "stable";
  trendDelta?: number;                      // e.g. +5 or -3
  showLabel?: boolean;
}

// ── Gauge math ─────────────────────────────────────────────────────────────

const CX = 60;
const CY = 60;
const R  = 48;
const STROKE_W = 8;
const CIRCUMFERENCE = 2 * Math.PI * R;
// Show 270° of the circle (3/4 arc), starting from bottom-left
const ARC_DEG = 270;
const ARC_FRACTION = ARC_DEG / 360;
const START_ANGLE = 135; // degrees from 12 o'clock (clockwise), i.e. bottom-left

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end   = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// ── Color helpers ──────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 70) return TP.recoveryHigh;
  if (score >= 40) return TP.recoveryMid;
  return TP.recoveryLow;
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Optimal";
  if (score >= 70) return "Good";
  if (score >= 55) return "Building";
  if (score >= 40) return "Recovering";
  if (score >= 25) return "Depleted";
  return "Critical";
}

function trendArrow(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

function trendColor(trend: "up" | "down" | "stable"): string {
  if (trend === "up") return TP.recoveryHigh;
  if (trend === "down") return TP.recoveryLow;
  return TP.textMuted;
}

// ── Component ─────────────────────────────────────────────────────────────

export function RecoveryScore({ score, trend, trendDelta, showLabel = true }: Props) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const color = scoreColor(clampedScore);
  const label = scoreLabel(clampedScore);

  // Arc: 270° total, start at 135°, fill proportional to score
  const endDeg = START_ANGLE + (clampedScore / 100) * ARC_DEG;
  const trackEndDeg = START_ANGLE + ARC_DEG;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* Gauge SVG */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 120 120"
          width={120}
          height={120}
          aria-label={`Recovery score: ${clampedScore} out of 100 — ${label}`}
        >
          {/* Track (background arc) */}
          <path
            d={arcPath(CX, CY, R, START_ANGLE, trackEndDeg)}
            fill="none"
            stroke={TP.border}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />

          {/* Glow layer */}
          {clampedScore > 0 && (
            <path
              d={arcPath(CX, CY, R, START_ANGLE, endDeg)}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_W + 4}
              strokeLinecap="round"
              opacity="0.15"
              style={{ filter: "blur(3px)" }}
            />
          )}

          {/* Score arc */}
          {clampedScore > 0 && (
            <path
              d={arcPath(CX, CY, R, START_ANGLE, endDeg)}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_W}
              strokeLinecap="round"
            />
          )}

          {/* Score number */}
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            fontSize="26"
            fontWeight="800"
            fill={TP.textPrimary}
          >
            {clampedScore}
          </text>

          {/* /100 label */}
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            fontSize="9"
            fill={TP.textMuted}
          >
            / 100
          </text>

          {/* Status label inside gauge */}
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={color}
          >
            {label}
          </text>
        </svg>
      </div>

      {/* Trend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 13,
        }}
      >
        <span
          style={{
            color: trendColor(trend),
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {trendArrow(trend)}
        </span>
        {trendDelta !== undefined && (
          <span style={{ color: trendColor(trend), fontWeight: 600, fontSize: 13 }}>
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {Math.abs(trendDelta)} pts
          </span>
        )}
        <span style={{ color: TP.textMuted, fontSize: 12 }}>vs last week</span>
      </div>

      {/* Composition hint */}
      {showLabel && (
        <p
          style={{
            fontSize: 11,
            color: TP.textMuted,
            textAlign: "center",
            maxWidth: 140,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Avg of focus, calm & energy with streak multiplier
        </p>
      )}
    </div>
  );
}
