"use client";

/**
 * ProgressBar8Week — 56-day journey progress bar.
 *
 * Shows:
 * - Filled bar (completed days / 56)
 * - Phase labels at phase boundaries (Stabilize 1–7, Build 8–56)
 * - Current day marker with pulse animation
 * - Week tick marks (weeks 1–8)
 */

import { TP } from "./tokens";

interface Props {
  currentDay: number; // 1–56
  totalDays?: number;
}

const PHASES = [
  { label: "Stabilize", startDay: 1, endDay: 7, color: "#60a5fa" },
  { label: "Build",     startDay: 8, endDay: 56, color: "#10b981" },
];

export function ProgressBar8Week({ currentDay, totalDays = 56 }: Props) {
  const pct = Math.min(100, Math.max(0, ((currentDay - 1) / (totalDays - 1)) * 100));
  const weeksCompleted = Math.floor((currentDay - 1) / 7);
  const daysRemaining = totalDays - currentDay + 1;

  // Current phase
  const currentPhase = PHASES.find((p) => currentDay >= p.startDay && currentDay <= p.endDay) ?? PHASES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Stats row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: TP.textPrimary,
              lineHeight: 1,
            }}
          >
            Day {currentDay}
          </span>
          <span style={{ fontSize: 14, color: TP.textMuted }}>of {totalDays}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontSize: 13,
              color: currentPhase.color,
              fontWeight: 600,
              background: `${currentPhase.color}18`,
              border: `1px solid ${currentPhase.color}33`,
              padding: "2px 10px",
              borderRadius: 20,
            }}
          >
            {currentPhase.label} Phase
          </span>
          {daysRemaining > 1 && (
            <p style={{ fontSize: 11, color: TP.textMuted, margin: "4px 0 0", textAlign: "right" }}>
              {daysRemaining} days remaining
            </p>
          )}
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 10,
          background: TP.border,
          borderRadius: 999,
          overflow: "visible",
        }}
      >
        {/* Phase fills */}
        {PHASES.map((phase) => {
          const phaseStart = ((phase.startDay - 1) / (totalDays - 1)) * 100;
          const phaseEnd = ((phase.endDay - 1) / (totalDays - 1)) * 100;
          const filledEnd = Math.min(pct, phaseEnd);
          if (filledEnd <= phaseStart) return null;
          return (
            <div
              key={phase.label}
              style={{
                position: "absolute",
                left: `${phaseStart}%`,
                width: `${filledEnd - phaseStart}%`,
                height: "100%",
                background: phase.color,
                borderRadius: "999px",
                opacity: 0.85,
              }}
            />
          );
        })}

        {/* Current day marker */}
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: currentPhase.color,
            border: `3px solid ${TP.bgCard}`,
            boxShadow: `0 0 0 3px ${currentPhase.color}40`,
            zIndex: 2,
          }}
          aria-label={`Current position: Day ${currentDay}`}
        />

        {/* Week tick marks */}
        {Array.from({ length: 7 }, (_, i) => {
          const weekDay = (i + 1) * 7; // Day 7, 14, 21, 28, 35, 42, 49
          const tickPct = ((weekDay - 1) / (totalDays - 1)) * 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${tickPct}%`,
                top: "100%",
                transform: "translateX(-50%)",
                marginTop: 4,
                width: 1,
                height: 5,
                background: TP.textMuted,
                opacity: 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Week labels */}
      <div
        style={{
          position: "relative",
          height: 16,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const weekStart = i * 7 + 1; // Day 1, 8, 15, ...
          const positionPct = ((weekStart - 1) / (totalDays - 1)) * 100;
          const isCompleted = weekStart <= currentDay;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${positionPct}%`,
                transform: "translateX(-50%)",
                fontSize: 10,
                color: isCompleted ? TP.textSecondary : TP.textMuted,
                fontWeight: isCompleted ? 600 : 400,
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              W{i + 1}
            </span>
          );
        })}
      </div>

      {/* Phase boundary label */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        {PHASES.map((phase) => (
          <div key={phase.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: phase.color,
                opacity: 0.7,
              }}
            />
            <span style={{ fontSize: 11, color: TP.textMuted }}>
              {phase.label} (Days {phase.startDay}–{phase.endDay})
            </span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: TP.textSecondary, fontWeight: 600 }}>
          {weeksCompleted} wk{weeksCompleted !== 1 ? "s" : ""} complete
        </span>
      </div>
    </div>
  );
}
