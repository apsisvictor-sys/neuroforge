"use client";

/**
 * MilestoneCard — Day 7 / 14 / 30 / 56 celebration cards.
 *
 * Locked: grey with padlock, upcoming feel
 * Unlocked: golden glow, neuroscience messaging, celebratory
 * Just-reached: extra glow pulse animation
 */

import { TP, MILESTONE_CONFIG } from "./tokens";

// ── Single card ────────────────────────────────────────────────────────────

interface MilestoneCardProps {
  milestone: (typeof MILESTONE_CONFIG)[number];
  reached: boolean;
  isCurrent: boolean; // today just crossed this milestone
}

function MilestoneCardItem({ milestone, reached, isCurrent }: MilestoneCardProps) {
  const gold  = TP.milestoneGold;
  const grey  = TP.milestoneSilver;
  const color = reached ? gold : grey;

  return (
    <div
      role="article"
      aria-label={`${milestone.label} milestone — ${reached ? "achieved" : "upcoming"}`}
      style={{
        position: "relative",
        background: reached ? TP.milestoneBg : "rgba(30,58,95,0.2)",
        border: `1px solid ${reached ? TP.milestoneBorder : TP.border}`,
        borderRadius: 16,
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 160,
        flex: "1 1 160px",
        transition: "border-color 0.2s, background 0.2s",
        // Current milestone gets a subtle glow
        boxShadow: isCurrent
          ? `0 0 0 2px ${gold}40, 0 4px 20px ${TP.milestoneGlow}`
          : reached
          ? `0 4px 16px ${TP.milestoneGlow}`
          : "none",
      }}
    >
      {/* Day badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: reached ? gold : grey,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Day {milestone.day}
        </span>
        {isCurrent && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#fff",
              background: gold,
              padding: "2px 7px",
              borderRadius: 10,
              letterSpacing: "0.05em",
            }}
          >
            NEW
          </span>
        )}
        {!reached && (
          <span style={{ fontSize: 13, color: grey, opacity: 0.5 }} aria-hidden="true">
            🔒
          </span>
        )}
      </div>

      {/* Icon */}
      <div
        style={{
          fontSize: 28,
          lineHeight: 1,
          filter: reached ? "none" : "grayscale(1) opacity(0.3)",
        }}
        aria-hidden="true"
      >
        {milestone.icon}
      </div>

      {/* Title */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          color: reached ? TP.textPrimary : grey,
          lineHeight: 1.3,
        }}
      >
        {reached ? milestone.title : milestone.label}
      </p>

      {/* Body — only show if reached */}
      {reached && (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: TP.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {milestone.body}
        </p>
      )}

      {/* Upcoming hint */}
      {!reached && (
        <p style={{ margin: 0, fontSize: 11, color: TP.textMuted }}>
          {milestone.label} ahead
        </p>
      )}
    </div>
  );
}

// ── MilestoneCelebrations (full row) ──────────────────────────────────────

interface Props {
  currentDay: number;
}

export function MilestoneCelebrations({ currentDay }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: TP.textPrimary,
            letterSpacing: "-0.01em",
          }}
        >
          Milestones
        </h3>
        <span style={{ fontSize: 11, color: TP.textMuted }}>
          {MILESTONE_CONFIG.filter((m) => currentDay >= m.day).length} / {MILESTONE_CONFIG.length} reached
        </span>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
        role="list"
        aria-label="Protocol milestones"
      >
        {MILESTONE_CONFIG.map((milestone) => {
          const reached = currentDay >= milestone.day;
          // "current" = we are within the 7-day window after reaching it
          const isCurrent = reached && currentDay < milestone.day + 7;
          return (
            <div key={milestone.day} role="listitem">
              <MilestoneCardItem
                milestone={milestone}
                reached={reached}
                isCurrent={isCurrent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
