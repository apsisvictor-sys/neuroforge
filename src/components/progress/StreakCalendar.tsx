"use client";

/**
 * StreakCalendar — GitHub-style heatmap for 56-day protocol completion.
 *
 * Layout: 8 columns (weeks) × 7 rows (Mon–Sun)
 * Color: 4-level green intensity based on task completion %, or red for missed
 * Interaction: hover tooltip showing day number + completion rate
 */

import { useState } from "react";
import { TP, type DayCheckIn } from "./tokens";

// ── Day-of-week labels ─────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Color helpers ──────────────────────────────────────────────────────────

function completionColor(checkIn: DayCheckIn | undefined, isPast: boolean, isFuture: boolean): string {
  if (isFuture) return TP.streakFuture;
  if (!isPast) return TP.streakFuture;
  if (!checkIn) return TP.streakMissed; // past day with no data = missed
  const ratio = checkIn.totalTasks > 0 ? checkIn.tasksCompleted / checkIn.totalTasks : 0;
  if (ratio >= 0.9) return TP.streakLevel4;
  if (ratio >= 0.65) return TP.streakLevel3;
  if (ratio >= 0.35) return TP.streakLevel2;
  if (ratio > 0) return TP.streakLevel1;
  return TP.streakMissed;
}

function completionBorder(checkIn: DayCheckIn | undefined, isPast: boolean, isFuture: boolean): string {
  if (isFuture || !isPast || !checkIn) return "transparent";
  const ratio = checkIn.totalTasks > 0 ? checkIn.tasksCompleted / checkIn.totalTasks : 0;
  if (ratio >= 0.9) return "rgba(16,185,129,0.5)";
  return "transparent";
}

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  checkIns: DayCheckIn[];
  currentDay: number; // 1-based (1–56)
  totalDays?: number;
}

// ── Component ─────────────────────────────────────────────────────────────

export function StreakCalendar({ checkIns, currentDay, totalDays = 56 }: Props) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null); // 0-indexed day

  // Map checkIns by dayNumber for O(1) lookup
  const byDay: Record<number, DayCheckIn> = {};
  for (const c of checkIns) {
    byDay[c.dayNumber] = c;
  }

  // Build 56-cell grid (0-indexed: 0 = Day 1, 55 = Day 56)
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const dayNumber = i + 1;
    const isPast = dayNumber < currentDay;
    const isToday = dayNumber === currentDay;
    const isFuture = dayNumber > currentDay;
    const checkIn = byDay[dayNumber];
    return { dayNumber, isPast, isToday, isFuture, checkIn };
  });

  // Grid: 8 columns (weeks) × 7 rows (days)
  // Reorder cells so col 0 = week 1, row 0 = Mon
  // cells are already in day-order; each week = 7 consecutive cells
  const CELL_SIZE = 26;
  const CELL_GAP = 4;
  const COLS = 8;
  const ROWS = 7;

  const hoveredCheckIn = hoveredCell !== null ? byDay[hoveredCell + 1] : null;
  const hoveredDay = hoveredCell !== null ? cells[hoveredCell] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Calendar grid */}
      <div style={{ display: "flex", gap: CELL_GAP + 2 }}>
        {/* Day-of-week labels */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
            gap: CELL_GAP,
            alignItems: "center",
          }}
        >
          {DAY_LABELS.map((label) => (
            <span
              key={label}
              style={{
                fontSize: 10,
                color: TP.textMuted,
                textAlign: "right",
                lineHeight: `${CELL_SIZE}px`,
                userSelect: "none",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Heatmap cells — arranged as weeks (columns) × days (rows) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
            gap: CELL_GAP,
            // Items placed in row-major order, but we want column-major (week columns)
            // Use gridAutoFlow column
            gridAutoFlow: "column",
          }}
        >
          {cells.map((cell) => {
            const bg = completionColor(cell.checkIn, cell.isPast, cell.isFuture);
            const border = completionBorder(cell.checkIn, cell.isPast, cell.isFuture);
            const isHovered = hoveredCell === cell.dayNumber - 1;
            const ratio =
              cell.checkIn && cell.checkIn.totalTasks > 0
                ? cell.checkIn.tasksCompleted / cell.checkIn.totalTasks
                : 0;

            return (
              <div
                key={cell.dayNumber}
                title={
                  cell.isFuture
                    ? `Day ${cell.dayNumber} (upcoming)`
                    : cell.checkIn
                    ? `Day ${cell.dayNumber}: ${cell.checkIn.tasksCompleted}/${cell.checkIn.totalTasks} tasks (${Math.round(ratio * 100)}%)`
                    : cell.isToday
                    ? `Day ${cell.dayNumber} (today)`
                    : `Day ${cell.dayNumber}: no data`
                }
                onMouseEnter={() => setHoveredCell(cell.dayNumber - 1)}
                onMouseLeave={() => setHoveredCell(null)}
                aria-label={`Day ${cell.dayNumber}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 4,
                  background: bg,
                  border: cell.isToday
                    ? `2px solid rgba(96,165,250,0.7)`
                    : `1px solid ${isHovered ? "rgba(240,244,255,0.15)" : border}`,
                  cursor: "default",
                  transition: "transform 0.1s, opacity 0.1s",
                  transform: isHovered ? "scale(1.15)" : "scale(1)",
                  position: "relative",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Hover info strip */}
      {hoveredDay ? (
        <div
          style={{
            fontSize: 12,
            color: TP.textSecondary,
            height: 18,
            transition: "opacity 0.1s",
          }}
        >
          {hoveredDay.isFuture ? (
            <span style={{ color: TP.textMuted }}>Day {hoveredDay.dayNumber} — upcoming</span>
          ) : hoveredDay.isToday ? (
            <span style={{ color: TP.metricFocus }}>Day {hoveredDay.dayNumber} — today</span>
          ) : hoveredCheckIn ? (
            <span>
              Day {hoveredDay.dayNumber} ·{" "}
              <span style={{ color: TP.recoveryHigh }}>
                {hoveredCheckIn.tasksCompleted}/{hoveredCheckIn.totalTasks} tasks
              </span>
              {hoveredCheckIn.focus !== null && (
                <span style={{ marginLeft: 8, color: TP.metricFocus }}>F{hoveredCheckIn.focus}</span>
              )}
              {hoveredCheckIn.calm !== null && (
                <span style={{ marginLeft: 6, color: TP.metricCalm }}>C{hoveredCheckIn.calm}</span>
              )}
              {hoveredCheckIn.energy !== null && (
                <span style={{ marginLeft: 6, color: TP.metricEnergy }}>E{hoveredCheckIn.energy}</span>
              )}
            </span>
          ) : (
            <span style={{ color: TP.streakMissed }}>Day {hoveredDay.dayNumber} — no check-in</span>
          )}
        </div>
      ) : (
        <div style={{ height: 18 }} />
      )}

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: TP.textMuted }}>Less</span>
        {[TP.streakEmpty, TP.streakLevel1, TP.streakLevel2, TP.streakLevel3, TP.streakLevel4].map((c, i) => (
          <div
            key={i}
            style={{ width: 12, height: 12, borderRadius: 2, background: c }}
          />
        ))}
        <span style={{ fontSize: 11, color: TP.textMuted }}>More</span>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: TP.streakMissed, marginLeft: 8 }} />
        <span style={{ fontSize: 11, color: TP.textMuted }}>Missed</span>
      </div>
    </div>
  );
}
