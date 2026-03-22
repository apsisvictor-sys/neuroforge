import { TS } from "./tokens";

export function SupplementDisclaimerBanner() {
  return (
    <div
      role="note"
      aria-label="Educational content disclaimer"
      style={{
        background: TS.disclaimerBg,
        border: `1px solid ${TS.disclaimerBorder}`,
        borderRadius: 10,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 24,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
      <p style={{ color: TS.disclaimerText, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
        <strong>Educational information only.</strong> Not medical advice. Consult a physician before starting any supplement.
      </p>
    </div>
  );
}
