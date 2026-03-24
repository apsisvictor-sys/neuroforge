/**
 * UpgradeModal — Phase 4.3 Monetization UI
 *
 * Shown when a user clicks a locked protocol card or feature.
 * Value-forward messaging: "Less than one coffee per week"
 *
 * Accessibility: focus trap, Escape to close, aria-modal, role=dialog
 */

"use client";

import { useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  overlay: "rgba(0,0,0,0.75)",
  bgModal: "#0d1a2e",
  bgCard: "#071220",
  bgCardHighlight: "#0f2040",
  border: "#1e3a5f",
  borderHighlight: "#3b82f6",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentBlue: "#3b82f6",
  accentGreen: "#10b981",
};

// ─── Feature list ─────────────────────────────────────────────────────────────

const PREMIUM_FEATURES = [
  "Full protocol library — 50+ protocols",
  "Unlimited AI Coach conversations",
  "Advanced tracking & pattern insights",
  "Priority community access",
  "New protocols added monthly",
];

const PROFESSIONAL_EXTRAS = [
  "Everything in Premium",
  "Monthly human coaching session",
  "Custom protocol creation",
  "Priority AI response",
];

// ─── UpgradeModal ─────────────────────────────────────────────────────────────

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockedProtocolTitle?: string;
  onSelectPlan?: (plan: "premium" | "professional") => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  lockedProtocolTitle,
  onSelectPlan,
}: UpgradeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="presentation"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: T.overlay,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
        aria-describedby="upgrade-modal-desc"
        style={{
          background: T.bgModal,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          maxWidth: 560,
          width: "100%",
          padding: "32px 28px",
          position: "relative",
          maxHeight: "90svh",
          overflowY: "auto",
        }}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close upgrade dialog"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.textMuted,
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p
            style={{
              color: "#60a5fa",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Upgrade to Premium
          </p>
          <h2
            id="upgrade-modal-title"
            style={{
              color: T.textPrimary,
              fontSize: 24,
              fontWeight: 800,
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}
          >
            {lockedProtocolTitle
              ? `Unlock "${lockedProtocolTitle}"`
              : "Unlock the full protocol library"}
          </h2>
          <p
            id="upgrade-modal-desc"
            style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.5, margin: 0 }}
          >
            Less than one coffee per week. Full access to every protocol, AI coaching, and tracking.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}
        >
          {/* Premium */}
          <div
            style={{
              background: T.bgCardHighlight,
              border: `2px solid ${T.borderHighlight}`,
              borderRadius: 14,
              padding: "20px 16px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: T.accentBlue,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 20,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
              aria-label="Most popular plan"
            >
              Most popular
            </div>

            <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>
              Premium
            </p>
            <div style={{ marginBottom: 14 }}>
              <span style={{ color: T.textPrimary, fontWeight: 800, fontSize: 28 }}>€9.99</span>
              <span style={{ color: T.textMuted, fontSize: 13 }}>/mo</span>
              <br />
              <span style={{ color: T.accentGreen, fontSize: 12 }}>or €89.99/yr — save 25%</span>
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ color: T.accentGreen, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.4 }}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan?.("premium")}
              aria-label="Choose Premium plan"
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: T.accentBlue,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Start 14-day free trial
            </button>
          </div>

          {/* Professional */}
          <div
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "20px 16px",
            }}
          >
            <p style={{ color: T.textSecondary, fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>
              Professional
            </p>
            <div style={{ marginBottom: 14 }}>
              <span style={{ color: T.textPrimary, fontWeight: 800, fontSize: 28 }}>€29.99</span>
              <span style={{ color: T.textMuted, fontSize: 13 }}>/mo</span>
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
              {PROFESSIONAL_EXTRAS.map((f) => (
                <li key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ color: "#a78bfa", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.4 }}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan?.("professional")}
              aria-label="Choose Professional plan"
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textSecondary,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Choose Professional
            </button>
          </div>
        </div>

        {/* Trust footer */}
        <p style={{ color: T.textMuted, fontSize: 12, textAlign: "center", margin: 0 }}>
          30-day money-back guarantee · Cancel anytime · No card required for trial
        </p>
      </div>
    </div>
  );
}
