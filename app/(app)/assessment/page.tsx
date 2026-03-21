"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS } from "@/domain/assessment/types";
import type { AssessmentResponses } from "@/domain/assessment/types";
import { postJson } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

const TOTAL = ASSESSMENT_QUESTIONS.length;

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = welcome, 1-12 = questions, 13 = submitting
  const [responses, setResponses] = useState<Partial<AssessmentResponses>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = step >= 1 && step <= TOTAL ? ASSESSMENT_QUESTIONS[step - 1] : null;
  const progress = step >= 1 ? Math.round(((step - 1) / TOTAL) * 100) : 0;

  function handleStart() {
    setStep(1);
    setSelected(null);
  }

  function handleNext() {
    if (!question || selected === null) return;
    const key = `q${question.id}` as keyof AssessmentResponses;
    setResponses((prev) => ({ ...prev, [key]: selected }));

    if (step < TOTAL) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      handleSubmit({ ...responses, [key]: selected } as AssessmentResponses);
    }
  }

  async function handleSubmit(finalResponses: AssessmentResponses) {
    setSubmitting(true);
    setError(null);
    try {
      await postJson("/api/assessment", { responses: finalResponses });
      router.push("/assessment/results");
    } catch (err) {
      setError((err as Error).message ?? "Submission failed. Please try again.");
      setSubmitting(false);
      setStep(TOTAL); // stay on last question
    }
  }

  // Welcome screen
  if (step === 0) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ marginBottom: 8 }}>Nervous System Assessment</h2>
        <p style={{ color: "#475569", marginBottom: 4 }}>
          <strong>~3 minutes · 12 questions</strong>
        </p>
        <p style={{ color: "#334155", marginBottom: 24 }}>
          You are not lazy. You are not broken. Your nervous system is dysregulated.
          This assessment will help identify your pattern and recommend a starting protocol.
        </p>
        <button
          onClick={handleStart}
          style={{ padding: "10px 24px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 }}
        >
          Start assessment
        </button>
      </main>
    );
  }

  // Question screen
  if (question) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Question {step} of {TOTAL}
            </span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3 }}>
            <div
              style={{ height: "100%", width: `${progress}%`, background: "#0f172a", borderRadius: 3, transition: "width 0.3s" }}
            />
          </div>
        </div>

        <h3 style={{ marginBottom: 20, fontSize: 20 }}>{question.text}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              style={{
                padding: "12px 16px",
                textAlign: "left",
                border: `2px solid ${selected === opt.value ? "#0f172a" : "#cbd5e1"}`,
                borderRadius: 8,
                background: selected === opt.value ? "#f1f5f9" : "#fff",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: selected === opt.value ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && (
          <FeedbackBanner type="error" message={error} />
        )}

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          {step > 1 && (
            <button
              onClick={() => { setStep((s) => s - 1); setSelected(responses[`q${step - 1}` as keyof AssessmentResponses] ?? null); }}
              disabled={submitting}
              style={{ padding: "10px 20px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", cursor: "pointer" }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={selected === null || submitting}
            style={{
              padding: "10px 24px",
              background: selected === null ? "#94a3b8" : "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: selected === null ? "not-allowed" : "pointer",
              fontSize: 15,
            }}
          >
            {submitting ? "Scoring…" : step === TOTAL ? "See my results" : "Next"}
          </button>
        </div>
      </main>
    );
  }

  return null;
}
