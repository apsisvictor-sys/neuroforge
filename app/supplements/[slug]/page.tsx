import { notFound } from "next/navigation";
import Link from "next/link";
import { TS, CATEGORY_CONFIG, PHASE_CONFIG } from "@/components/supplement/tokens";
import { SupplementDisclaimerBanner } from "@/components/supplement/SupplementDisclaimerBanner";
import { SupplementSection } from "@/components/supplement/SupplementSection";
import { getSupplementBySlug } from "@/data/supplements";
import type { PhaseName } from "@/components/supplement/tokens";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SupplementDetailPage({ params }: Props) {
  const { slug } = await params;
  const supplement = getSupplementBySlug(slug);

  if (!supplement || supplement.status !== "published") {
    notFound();
  }

  const cfg = CATEGORY_CONFIG[supplement.category];
  const evidenceCfg = {
    foundational: TS.evidenceFoundational,
    emerging:     TS.evidenceEmerging,
    limited:      TS.evidenceLimited,
  }[supplement.evidenceLevel];

  return (
    <main style={{ minHeight: "100vh", background: TS.bgPage, padding: "32px 20px", maxWidth: 780, margin: "0 auto" }}>
      {/* Back navigation */}
      <Link
        href="/supplements"
        aria-label="Back to supplement catalog"
        style={{ color: TS.textSecondary, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}
      >
        ← Back to catalog
      </Link>

      <SupplementDisclaimerBanner />

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", borderRadius: 20,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            color: cfg.color, fontSize: 11, fontWeight: 700,
          }}>
            {cfg.icon} {cfg.label}
          </span>
          <span style={{
            padding: "3px 10px", borderRadius: 20,
            background: `${evidenceCfg.color}15`,
            border: `1px solid ${evidenceCfg.color}30`,
            color: evidenceCfg.color, fontSize: 11, fontWeight: 700,
          }}>
            Evidence: {evidenceCfg.label}
          </span>
        </div>
        <h1 style={{ color: TS.textPrimary, fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>
          {supplement.name}
        </h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {supplement.phaseAlignment.map(({ phase }) => {
            const ph = PHASE_CONFIG[phase as PhaseName];
            return (
              <span key={phase} style={{
                padding: "2px 8px", borderRadius: 20,
                background: ph.bg, color: ph.color,
                fontSize: 11, fontWeight: 600,
              }}>
                {ph.label}
              </span>
            );
          })}
        </div>
      </div>

      <SupplementSection title="Mechanism" icon="🧠" variant="default">
        <p style={{ color: TS.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          {supplement.mechanismDetail}
        </p>
      </SupplementSection>

      <SupplementSection title="Typical Usage Context" icon="📖" variant="default">
        <p style={{ color: TS.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          {supplement.typicalUsageContext}
        </p>
      </SupplementSection>

      <SupplementSection title="Timing Considerations" icon="⏱" variant="default">
        <p style={{ color: TS.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          {supplement.timingNotes}
        </p>
      </SupplementSection>

      {supplement.safetyNotes.length > 0 && (
        <SupplementSection title="Safety Notes" icon="⚠" variant="warning">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {supplement.safetyNotes.map((note) => (
              <li key={note} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "#fcd34d", flexShrink: 0 }}>•</span>
                <span style={{ color: TS.textSecondary, fontSize: 14, lineHeight: 1.5 }}>{note}</span>
              </li>
            ))}
          </ul>
        </SupplementSection>
      )}

      {supplement.contraindications.length > 0 && (
        <SupplementSection title="Contraindications" icon="⛔" variant="danger">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {supplement.contraindications.map((item) => (
              <li key={item} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: TS.warningText, flexShrink: 0 }}>•</span>
                <span style={{ color: TS.warningText, fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </SupplementSection>
      )}

      {supplement.doNotCombine.length > 0 && (
        <SupplementSection title="Do Not Combine With" icon="🚫" variant="danger">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {supplement.doNotCombine.map((item) => (
              <li key={item} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: TS.warningText, flexShrink: 0 }}>•</span>
                <span style={{ color: TS.warningText, fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </SupplementSection>
      )}

      <SupplementSection title="Protocol Phase Alignment" icon="📍" variant="default">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {supplement.phaseAlignment.map(({ phase, rationale }) => {
            const ph = PHASE_CONFIG[phase as PhaseName];
            return (
              <div key={phase} style={{
                background: ph.bg,
                border: `1px solid ${ph.color}25`,
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 20,
                    background: ph.bg, color: ph.color,
                    fontSize: 11, fontWeight: 700,
                    border: `1px solid ${ph.color}30`,
                  }}>
                    {ph.label}
                  </span>
                  <span style={{ color: TS.textMuted, fontSize: 11 }}>Supportive, not primary</span>
                </div>
                <p style={{ color: TS.textSecondary, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  {rationale}
                </p>
              </div>
            );
          })}
        </div>
      </SupplementSection>

      {/* Sources */}
      <div style={{ borderTop: `1px solid ${TS.border}`, paddingTop: 20, marginTop: 8 }}>
        <p style={{ color: TS.textMuted, fontSize: 12, margin: "0 0 10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Sources · Last reviewed: {supplement.reviewedAt}
        </p>
        {supplement.sources.map((src) => (
          <div key={src.url} style={{ marginBottom: 8 }}>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", fontSize: 13, textDecoration: "underline" }}
            >
              {src.title}
            </a>
            <span style={{ color: TS.textMuted, fontSize: 12, marginLeft: 8 }}>
              {src.publisher} · {src.publishedAt}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
