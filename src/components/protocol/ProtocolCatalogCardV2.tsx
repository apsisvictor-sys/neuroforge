/**
 * ProtocolCatalogCardV2 — Phase 3.2 redesign
 *
 * Features:
 *   - Difficulty, pillar, and duration badges
 *   - Lock state for premium protocols (Phase 4.3)
 *   - Prerequisite indicator
 *   - Hover elevation effect
 *   - Accessible: keyboard navigable, ARIA labels
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import type { DifficultyLevel, Pillar } from "./ProtocolBadges";
import { ProtocolBadgeGroup } from "./ProtocolBadges";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProtocolCatalogItemV2 {
  slug: string;
  title: string;
  shortDescription: string;
  difficulty: DifficultyLevel;
  pillar: Pillar;
  totalDays: number;
  phaseCount: number;
  isLocked?: boolean; // Phase 4.3: free-tier gating
  prerequisiteSlug?: string; // Phase 3.2: prerequisite chain
  prerequisiteTitle?: string;
  scienceSummary?: string; // 1-sentence scientific rationale
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bgCard: "#0d1a2e",
  bgCardHover: "#102240",
  bgLocked: "#0a1020",
  border: "#1e3a5f",
  borderHover: "#2e5c8e",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentBlue: "#3b82f6",
  accentLocked: "#4a5568",
};

// ─── ProtocolCatalogCardV2 ────────────────────────────────────────────────────

export function ProtocolCatalogCardV2({ item, onUpgradeClick }: {
  item: ProtocolCatalogItemV2;
  onUpgradeClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const isLocked = item.isLocked ?? false;

  const cardStyle: React.CSSProperties = {
    background: isLocked ? T.bgLocked : hovered ? T.bgCardHover : T.bgCard,
    border: `1px solid ${hovered && !isLocked ? T.borderHover : T.border}`,
    borderRadius: 16,
    padding: "24px 20px",
    transition: "background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
    transform: hovered && !isLocked ? "translateY(-2px)" : "none",
    boxShadow: hovered && !isLocked ? "0 8px 32px rgba(59,130,246,0.1)" : "none",
    position: "relative",
    opacity: isLocked ? 0.8 : 1,
    cursor: isLocked ? "default" : "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    listStyle: "none",
  };

  const content = (
    <>
      {/* Lock overlay icon */}
      {isLocked && (
        <div
          aria-label="Premium protocol — locked"
          title="Available in Premium"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(74,85,104,0.3)",
            border: "1px solid #4a5568",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          🔒
        </div>
      )}

      {/* Badges */}
      <ProtocolBadgeGroup
        difficulty={item.difficulty}
        pillar={item.pillar}
        days={item.totalDays}
      />

      {/* Title */}
      <h3
        style={{
          color: isLocked ? T.textMuted : T.textPrimary,
          fontSize: 18,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.3,
          paddingRight: isLocked ? 32 : 0,
        }}
      >
        {item.title}
      </h3>

      {/* Short description */}
      <p
        style={{
          color: T.textSecondary,
          fontSize: 14,
          lineHeight: 1.55,
          margin: 0,
          filter: isLocked ? "blur(3px)" : "none",
          userSelect: isLocked ? "none" : "auto",
        }}
        aria-hidden={isLocked}
      >
        {item.shortDescription}
      </p>

      {/* Science summary */}
      {item.scienceSummary && !isLocked && (
        <p
          style={{
            color: "#60a5fa",
            fontSize: 12,
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {item.scienceSummary}
        </p>
      )}

      {/* Prerequisite */}
      {item.prerequisiteSlug && !isLocked && (
        <p style={{ color: T.textMuted, fontSize: 12, margin: 0 }}>
          Prerequisite:{" "}
          <Link
            href={`/protocol?slug=${item.prerequisiteSlug}`}
            style={{ color: "#60a5fa", textDecoration: "underline" }}
          >
            {item.prerequisiteTitle ?? item.prerequisiteSlug}
          </Link>
        </p>
      )}

      {/* CTA row */}
      <div style={{ marginTop: "auto" }}>
        {isLocked ? (
          <button
            onClick={onUpgradeClick}
            aria-label={`Unlock ${item.title} — upgrade to Premium`}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #4a5568",
              background: "transparent",
              color: "#94a3b8",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            🔒 Unlock with Premium
          </button>
        ) : (
          <Link
            href={`/protocol?slug=${item.slug}`}
            style={{
              display: "block",
              textAlign: "center",
              padding: "10px 16px",
              borderRadius: 10,
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
              color: "#60a5fa",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            View protocol →
          </Link>
        )}
      </div>
    </>
  );

  return (
    <li
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isLocked ? `${item.title} — locked, Premium required` : item.title}
    >
      {content}
    </li>
  );
}
