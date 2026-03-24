/**
 * TrialBanner — Phase 4.3 Monetization UI
 *
 * Sticky top banner shown to free-tier users during a trial period.
 * Shows days remaining and upgrade CTA.
 *
 * Accessibility: role=status, dismiss button with aria-label
 */

"use client";

import { useState } from "react";

interface TrialBannerProps {
  daysRemaining: number;
  onUpgradeClick: () => void;
}

export function TrialBanner({ daysRemaining, onUpgradeClick }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isUrgent = daysRemaining <= 3;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Trial banner: ${daysRemaining} days remaining in your free trial`}
      style={{
        background: isUrgent
          ? "linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.08) 100%)"
          : "linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.08) 100%)",
        borderBottom: `1px solid ${isUrgent ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <p style={{ color: "#f0f4ff", fontSize: 14, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <span aria-hidden="true">{isUrgent ? "⚡" : "🔓"}</span>
        <span>
          {isUrgent ? (
            <>
              <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left</strong> on your free trial
            </>
          ) : (
            <>
              <strong>{daysRemaining} days</strong> left in your free trial — unlock everything before it ends
            </>
          )}
        </span>
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={onUpgradeClick}
          aria-label="Upgrade to Premium now"
          style={{
            padding: "7px 18px",
            borderRadius: 8,
            border: "none",
            background: isUrgent ? "#ef4444" : "#3b82f6",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Upgrade now
        </button>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss trial banner"
          style={{
            background: "none",
            border: "none",
            color: "#4a5568",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
            padding: "2px 4px",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ─── FeatureTooltip ───────────────────────────────────────────────────────────

/**
 * FeatureTooltip — hover tooltip on locked features
 * Shows "Available in Premium" message
 */

interface FeatureTooltipProps {
  children: React.ReactNode;
  onUpgradeClick?: () => void;
}

export function FeatureTooltip({ children, onUpgradeClick }: FeatureTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0d1a2e",
            border: "1px solid #1e3a5f",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 12,
            color: "#94a3b8",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span>🔒 Available in Premium</span>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              style={{
                background: "#3b82f6",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                cursor: "pointer",
              }}
              aria-label="Upgrade to Premium to unlock this feature"
            >
              Upgrade →
            </button>
          )}
          {/* Arrow */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 10,
              height: 10,
              background: "#0d1a2e",
              borderRight: "1px solid #1e3a5f",
              borderBottom: "1px solid #1e3a5f",
            }}
          />
        </span>
      )}
    </span>
  );
}
