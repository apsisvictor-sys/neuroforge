"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJson } from "@/ui/hooks/use-api";
import { TYPE_LABELS, RECOMMENDATIONS } from "@/domain/assessment/scoring";
import type { AssessmentResult, NervousSystemType } from "@/domain/assessment/types";
import { LoadingSpinner } from "@/ui/components/LoadingSpinner";

const TYPE_EXPLANATIONS: Record<NervousSystemType, string> = {
  Overstimulated:
    "Your nervous system is running hot — high novelty-seeking, fragmented attention, and elevated stimulation load have pushed your threshold for focus. This is an adaptive state, not a personal failure. The brain learned to expect and need high input to function.",
  BurnedOut:
    "Your nervous system is running on empty. Depleted reward pathways, low drive, and reduced pleasure response signal a state of resource exhaustion. This is a recovery state — the system needs restoration, not more demands.",
  Anxious:
    "Your nervous system is in a state of hypervigilance — threat-biased attention, anticipatory stress, and a sensitized stress response are consuming bandwidth that should go to focus. This is a protective state that became chronic.",
  InRecovery:
    "Your nervous system is in active rebuilding. Prior compulsive cycles or stimulant use have remodeled your baseline. The path forward is structure, consistency, and trigger insulation — not willpower.",
};

type ApiResponse = { result: AssessmentResult | null };

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<ApiResponse>("/api/assessment")
      .then((data) => {
        if (!data.result) {
          router.replace("/assessment");
        } else {
          setResult(data.result);
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ padding: 24, color: "red" }}>Error loading results: {error}</p>;
  if (!result) return null;

  const typeLabel = TYPE_LABELS[result.primaryType];
  const explanation = TYPE_EXPLANATIONS[result.primaryType];

  const scoreEntries: [string, number][] = [
    ["Overstimulated", result.scores.overstimulatedScore],
    ["Burned Out", result.scores.burnedOutScore],
    ["Anxious", result.scores.anxiousScore],
    ["In Recovery", result.scores.recoveryScore],
  ];

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero */}
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Your nervous system pattern</p>
      <h2 style={{ fontSize: 28, marginBottom: 4 }}>{typeLabel}</h2>
      {result.secondaryType && (
        <p style={{ color: "#64748b", marginBottom: 8, fontSize: 14 }}>
          You may also recognise overlap with <strong>{TYPE_LABELS[result.secondaryType]}</strong>.
        </p>
      )}
      <p style={{ color: "#475569", marginBottom: 24, fontStyle: "italic" }}>
        This is an adaptive state, not a personal failure.
      </p>

      {/* Explanation */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Why this happens</h3>
        <p style={{ color: "#334155", lineHeight: 1.6 }}>{explanation}</p>
      </section>

      {/* Top 3 symptom drivers */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Your top symptom drivers</h3>
        <ol style={{ paddingLeft: 20, color: "#334155", lineHeight: 1.8 }}>
          {result.topSymptoms.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {/* Score breakdown */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Pattern breakdown</h3>
        {scoreEntries.map(([label, score]) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 2 }}>
              <span style={{ fontWeight: label === typeLabel ? 700 : 400 }}>{label}</span>
              <span style={{ color: "#64748b" }}>{score}</span>
            </div>
            <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4 }}>
              <div
                style={{
                  height: "100%",
                  width: `${score}%`,
                  background: label === typeLabel ? "#0f172a" : "#94a3b8",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Recommended protocol */}
      <section style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Recommended starting track</h3>
        <p style={{ color: "#334155", lineHeight: 1.6 }}>{result.recommendedProtocolTrack}</p>
      </section>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="/protocols"
          style={{
            padding: "10px 24px",
            background: "#0f172a",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          Start my plan
        </a>
        <button
          onClick={() => router.push("/assessment")}
          style={{
            padding: "10px 20px",
            border: "1px solid #cbd5e1",
            borderRadius: 6,
            background: "#fff",
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Review my answers
        </button>
      </div>
    </main>
  );
}
