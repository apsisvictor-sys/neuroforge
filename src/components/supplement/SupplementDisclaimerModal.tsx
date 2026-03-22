"use client";
import { useEffect, useRef } from "react";
import { TS } from "./tokens";

interface Props {
  isOpen: boolean;
  onAcknowledge: () => void;
}

export function SupplementDisclaimerModal({ isOpen, onAcknowledge }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) btnRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="supp-disclaimer-title"
        style={{
          background: TS.bgCard,
          border: `1px solid ${TS.disclaimerBorder}`,
          borderRadius: 20,
          maxWidth: 480,
          width: "100%",
          padding: "36px 28px",
        }}
      >
        <div style={{ textAlign: "center", fontSize: 40, marginBottom: 16 }} aria-hidden="true">
          📚
        </div>
        <h2
          id="supp-disclaimer-title"
          style={{ color: TS.textPrimary, fontSize: 22, fontWeight: 800, textAlign: "center", margin: "0 0 12px" }}
        >
          Supplement Education
        </h2>
        <p style={{ color: TS.textSecondary, fontSize: 15, lineHeight: 1.6, textAlign: "center", margin: "0 0 20px" }}>
          This section contains{" "}
          <strong style={{ color: TS.textPrimary }}>educational information only</strong>{" "}
          about neurochemical support supplements.
        </p>
        <div style={{
          background: TS.warningBg,
          border: `1px solid ${TS.warningBorder}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 24,
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Not a substitute for medical advice",
              "Consult a physician before starting any supplement",
              "No personalized recommendations or dosing guidance",
              "No purchase links or affiliate content",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ color: TS.warningText, flexShrink: 0, marginTop: 1 }}>•</span>
                <span style={{ color: TS.warningText, fontSize: 13, lineHeight: 1.45 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          ref={btnRef}
          onClick={onAcknowledge}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: TS.accentBlue,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          I understand — show me the education
        </button>
        <p style={{ color: TS.textMuted, fontSize: 12, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
          You will only see this once.
        </p>
      </div>
    </div>
  );
}
