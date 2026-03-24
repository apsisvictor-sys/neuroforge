"use client";

/**
 * MetricTrendChart — SVG line chart for focus / calm / energy over time.
 *
 * Renders up to 3 overlaid smooth curves with gradient fills.
 * No external charting library — pure SVG path math.
 *
 * Interaction: click tabs to toggle which metrics are visible.
 */

import { useState } from "react";
import { TP, METRIC_CONFIG, type MetricKey, type DayCheckIn } from "./tokens";

// ── SVG path math ──────────────────────────────────────────────────────────

const VIEW_W = 420;
const VIEW_H = 130;
const PAD_X  = 28;  // left  (y-axis labels)
const PAD_Y  = 12;  // top + bottom
const DRAW_W = VIEW_W - PAD_X - 10;
const DRAW_H = VIEW_H - PAD_Y * 2;

function valueToSVG(v: number, minV: number, maxV: number): number {
  return PAD_Y + DRAW_H - ((v - minV) / (maxV - minV)) * DRAW_H;
}

function indexToX(i: number, n: number): number {
  return PAD_X + (n <= 1 ? 0 : (i / (n - 1)) * DRAW_W);
}

interface Point { x: number; y: number; }

function smoothPath(pts: Point[]): string {
  if (pts.length < 2) return "";
  return pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const cp1x = ((prev.x + p.x) / 2).toFixed(1);
      const cp2x = ((prev.x + p.x) / 2).toFixed(1);
      return `C ${cp1x} ${prev.y.toFixed(1)} ${cp2x} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");
}

function areaPath(pts: Point[], bottomY: number): string {
  if (pts.length < 2) return "";
  const line = smoothPath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L ${last.x.toFixed(1)} ${bottomY} L ${first.x.toFixed(1)} ${bottomY} Z`;
}

// ── Build data points ──────────────────────────────────────────────────────

function buildPoints(checkIns: DayCheckIn[], metric: MetricKey): Point[] {
  return checkIns
    .filter((c) => c[metric] !== null)
    .map((c, idx, arr) => ({
      x: indexToX(arr.indexOf(c), arr.length),
      y: valueToSVG(c[metric] as number, 0, 10),
    }));
}

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  checkIns: DayCheckIn[];
  initialMetrics?: MetricKey[];
}

// ── Component ─────────────────────────────────────────────────────────────

export function MetricTrendChart({ checkIns, initialMetrics = ["focus", "calm", "energy"] }: Props) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(new Set(initialMetrics));
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  function toggleMetric(m: MetricKey) {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(m) && next.size === 1) return next; // keep at least one
      if (next.has(m)) { next.delete(m); } else { next.add(m); }
      return next;
    });
  }

  // Y-axis labels
  const yLabels = [10, 7, 5, 3, 0];

  // Find closest check-in for hover crosshair
  const hoverCheckIn =
    hoveredX !== null && checkIns.length > 0
      ? checkIns.reduce((best, c) => {
          const x = indexToX(checkIns.indexOf(c), checkIns.length);
          return Math.abs(x - hoveredX) < Math.abs(indexToX(checkIns.indexOf(best), checkIns.length) - hoveredX) ? c : best;
        })
      : null;

  const bottomY = PAD_Y + DRAW_H;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Metric tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((m) => {
          const cfg = METRIC_CONFIG[m];
          const active = activeMetrics.has(m);
          return (
            <button
              key={m}
              onClick={() => toggleMetric(m)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${active ? cfg.color : TP.border}`,
                background: active ? `${cfg.color}18` : "transparent",
                color: active ? cfg.color : TP.textMuted,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: active ? cfg.color : TP.textMuted,
                  flexShrink: 0,
                }}
              />
              {cfg.label}
            </button>
          );
        })}

        {/* Current values */}
        {hoverCheckIn && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: TP.textMuted }}>Day {hoverCheckIn.dayNumber}</span>
            {(Object.keys(METRIC_CONFIG) as MetricKey[])
              .filter((m) => activeMetrics.has(m) && hoverCheckIn[m] !== null)
              .map((m) => (
                <span key={m} style={{ fontSize: 12, color: METRIC_CONFIG[m].color, fontWeight: 700 }}>
                  {hoverCheckIn[m]}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* SVG chart */}
      <div
        style={{ position: "relative", width: "100%" }}
        onMouseLeave={() => setHoveredX(null)}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          style={{ width: "100%", height: "auto", display: "block" }}
          onMouseMove={(e) => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const svgX = ((e.clientX - rect.left) / rect.width) * VIEW_W;
            setHoveredX(svgX);
          }}
        >
          <defs>
            {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((m) => (
              <linearGradient key={m} id={`grad-${m}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={METRIC_CONFIG[m].color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={METRIC_CONFIG[m].color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines + Y-axis labels */}
          {yLabels.map((v) => {
            const y = valueToSVG(v, 0, 10);
            return (
              <g key={v}>
                <line
                  x1={PAD_X}
                  y1={y}
                  x2={VIEW_W - 10}
                  y2={y}
                  stroke={TP.border}
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                  opacity="0.6"
                />
                <text
                  x={PAD_X - 5}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="9"
                  fill={TP.textMuted}
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Metric lines + areas */}
          {(Object.keys(METRIC_CONFIG) as MetricKey[])
            .filter((m) => activeMetrics.has(m))
            .map((m) => {
              const pts = buildPoints(checkIns, m);
              if (pts.length < 2) return null;
              const color = METRIC_CONFIG[m].color;
              return (
                <g key={m}>
                  {/* Fill area */}
                  <path
                    d={areaPath(pts, bottomY)}
                    fill={`url(#grad-${m})`}
                  />
                  {/* Line */}
                  <path
                    d={smoothPath(pts)}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* End dot */}
                  {pts.length > 0 && (
                    <circle
                      cx={pts[pts.length - 1].x}
                      cy={pts[pts.length - 1].y}
                      r="3.5"
                      fill={color}
                      stroke={TP.bgCard}
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}

          {/* Hover crosshair */}
          {hoveredX !== null && hoverCheckIn && (
            <line
              x1={indexToX(checkIns.indexOf(hoverCheckIn), checkIns.length)}
              y1={PAD_Y}
              x2={indexToX(checkIns.indexOf(hoverCheckIn), checkIns.length)}
              y2={bottomY}
              stroke="rgba(240,244,255,0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}
        </svg>
      </div>

      {/* X-axis date range */}
      {checkIns.length >= 2 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: TP.textMuted }}>Day {checkIns[0].dayNumber}</span>
          <span style={{ fontSize: 11, color: TP.textMuted }}>Last 30 days</span>
          <span style={{ fontSize: 10, color: TP.textMuted }}>Day {checkIns[checkIns.length - 1].dayNumber}</span>
        </div>
      )}
    </div>
  );
}
