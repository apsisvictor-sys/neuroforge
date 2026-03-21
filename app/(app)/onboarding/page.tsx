"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS } from "@/domain/assessment/types";
import { computeAssessment, TYPE_LABELS, RECOMMENDATIONS } from "@/domain/assessment/scoring";
import type { AssessmentResponses, AssessmentResult, NervousSystemType } from "@/domain/assessment/types";
import { postJson, getJson } from "@/ui/hooks/use-api";

// ─── Design tokens ───────────────────────────────────────────────────────────

const C = {
  bgBase:       "#0a0e14",
  bgSurface:    "#111827",
  bgElevated:   "#1c2533",
  bgMuted:      "#253040",
  textPrimary:  "#f0f4f8",
  textSecondary:"#9aabb9",
  textMuted:    "#5c7184",
  textInverse:  "#0a0e14",
  accent:       "#38bdf8",
  accentDim:    "#0c3f57",
  accentGlow:   "rgba(56, 189, 248, 0.12)",
  success:      "#34d399",
  error:        "#f87171",
  borderDefault:"rgba(255,255,255,0.08)",
  borderActive: "rgba(56,189,248,0.4)",
  typeColors: {
    Overstimulated: "#f97316",
    BurnedOut:      "#8b5cf6",
    Anxious:        "#38bdf8",
    InRecovery:     "#34d399",
  } as Record<NervousSystemType, string>,
};

const AUTOSAVE_KEY = "nf_onboarding_responses";
const TOTAL_STEPS = 8;
const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length;

// How-it-works screen data
const HOW_IT_WORKS = [
  {
    icon: "📋",
    badge: "How Neuroforge works",
    title: "Small, consistent actions beat intensity spikes.",
    body: "Each day, you complete a short set of protocol tasks — 10 to 20 minutes. Consistency over time is what rebuilds your nervous system's baseline.",
  },
  {
    icon: "📊",
    badge: "Daily tracking",
    title: "See your regulation trends — without judgment.",
    body: "Each day you log three signals: Focus · Calm · Energy. Over time, you'll see what moves the needle and what doesn't.",
  },
  {
    icon: "🤖",
    badge: "Your AI guide",
    title: "A guide, not a guru. Evidence-first, always.",
    body: "Your Neuroforge guide explains the neuroscience behind your protocol, helps you reflect on patterns, and never tells you what to feel.",
  },
];

const TYPE_EXPLANATIONS: Record<NervousSystemType, string> = {
  Overstimulated:
    "High novelty-seeking, fragmented attention, and elevated stimulation load have pushed your threshold for focus. Your brain learned to expect and need high input to function. This is a pattern that responds well to structured stimulus reduction.",
  BurnedOut:
    "Depleted reward pathways, low drive, and reduced pleasure response signal a state of resource exhaustion. Your nervous system needs restoration, not more demands. Small wins and circadian stabilisation are the entry points.",
  Anxious:
    "Hypervigilance, threat-biased attention, and a sensitised stress response are consuming bandwidth that should go to focus. This is a protective state that became chronic — and it responds to somatic regulation.",
  InRecovery:
    "Prior compulsive cycles or stimulant use have remodelled your baseline. The path forward is structure, consistency, and trigger insulation. The nervous system is rebuilding — and it can.",
};

// ─── Shared UI primitives ────────────────────────────────────────────────────

function Layout({ children, step }: { children: React.ReactNode; step: number }) {
  const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div style={{ minHeight: "100vh", background: C.bgBase, color: C.textPrimary, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, padding: "12px 24px", background: C.bgBase, borderBottom: `1px solid ${C.borderDefault}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Step {step} of {TOTAL_STEPS}</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: C.bgMuted, borderRadius: 999 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 999, transition: "width 250ms ease-out" }}
              role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px 120px" }}>
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", height: 52, borderRadius: 20, border: "none",
        background: disabled ? `${C.accent}59` : C.accent,
        color: C.textInverse, fontSize: 14, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 150ms",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent", border: `1px solid ${C.borderDefault}`,
        borderRadius: 8, color: C.textSecondary, fontSize: 14, fontWeight: 500,
        padding: "10px 20px", cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Badge({ label, color }: { label: string; color?: string }) {
  const col = color ?? C.accent;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "4px 10px",
      borderRadius: 999, border: `1px solid ${col}`,
      color: col, background: `${col}1a`,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

// ─── Step screens ────────────────────────────────────────────────────────────

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <Layout step={1}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 64, marginTop: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: C.accent, marginBottom: 64 }}>
            NEUROFORGE
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            You are not lazy.<br />You are not broken.
          </h1>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: C.accent, marginBottom: 24 }}>
            Your nervous system is dysregulated.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.textSecondary, maxWidth: 400, margin: "0 auto" }}>
            Neuroforge helps you retrain regulation through structured daily protocols — not willpower, not shame.
          </p>
        </div>
        <PrimaryButton onClick={onNext}>Begin my assessment</PrimaryButton>
      </div>
    </Layout>
  );
}

function HowItWorksScreen({ substep, onNext, onBack }: { substep: number; onNext: () => void; onBack: () => void }) {
  const data = HOW_IT_WORKS[substep - 1];
  const step = substep + 1; // step 2, 3, 4 in overall flow
  return (
    <Layout step={step}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{data.icon}</div>
        <Badge label={data.badge} />
        <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, marginBottom: 16, lineHeight: 1.35 }}>{data.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: C.textSecondary, marginBottom: 40 }}>{data.body}</p>
        {substep === 2 && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
            {["Focus", "Calm", "Energy"].map((metric) => (
              <div key={metric} style={{
                flex: 1, background: C.bgSurface, border: `1px solid ${C.borderDefault}`,
                borderRadius: 8, padding: "12px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 4 }}>{metric}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.accent }}>—</div>
              </div>
            ))}
          </div>
        )}
        {substep === 3 && (
          <div style={{
            background: C.bgSurface, border: `1px solid ${C.borderDefault}`, borderRadius: 8,
            padding: 16, marginBottom: 40, textAlign: "left",
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>💬</div>
            <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              {`"This week's disrupted sleep pattern is consistent with cortisol peaks from late-evening screen use. Here's one thing you can adjust..."`}
            </p>
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          {substep > 1 && <SecondaryButton onClick={onBack}>Back</SecondaryButton>}
          <div style={{ flex: 1 }}>
            <PrimaryButton onClick={onNext}>{substep === 3 ? "Start my assessment →" : "Next"}</PrimaryButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AssessmentScreen({
  questionIndex,
  responses,
  onAnswer,
  onBack,
  savedIndicator,
}: {
  questionIndex: number;
  responses: Partial<AssessmentResponses>;
  onAnswer: (value: number) => void;
  onBack: () => void;
  savedIndicator: boolean;
}) {
  const question = ASSESSMENT_QUESTIONS[questionIndex];
  const qKey = `q${question.id}` as keyof AssessmentResponses;
  const currentValue = responses[qKey] ?? null;

  return (
    <Layout step={5}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 0, fontSize: 14 }}
        >
          ← Back
        </button>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>Question {question.id} of {TOTAL_QUESTIONS}</div>
          {savedIndicator && (
            <div style={{ fontSize: 11, color: C.success, marginTop: 2 }}>✓ Saved</div>
          )}
        </div>
      </div>

      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.35, marginBottom: 24, color: C.textPrimary, padding: 0 }}>
          {question.text}
        </legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <label
                key={opt.value}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  border: `1px solid ${isSelected ? C.accent : C.borderDefault}`,
                  borderRadius: 8, padding: 16, background: isSelected ? C.accentDim : C.bgSurface,
                  boxShadow: isSelected ? `0 0 0 1px ${C.accent}, 0 0 8px ${C.accentGlow}` : "none",
                  cursor: "pointer", transition: "border-color 200ms, background 200ms",
                }}
              >
                <input
                  type="radio" name={`q${question.id}`} value={opt.value}
                  checked={isSelected}
                  onChange={() => onAnswer(opt.value)}
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                />
                <span style={{ fontSize: 15, color: C.textPrimary }}>{opt.label}</span>
                {isSelected && <span style={{ color: C.accent, fontSize: 14, fontWeight: 700 }}>✓</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div style={{ marginTop: 32 }}>
        <PrimaryButton onClick={() => currentValue !== null && onAnswer(currentValue)} disabled={currentValue === null}>
          {questionIndex === TOTAL_QUESTIONS - 1 ? "See my results →" : "Next →"}
        </PrimaryButton>
      </div>
    </Layout>
  );
}

function ResultsScreen({ result, onNext }: { result: AssessmentResult; onNext: () => void }) {
  const typeColor = C.typeColors[result.primaryType];
  const typeLabel = TYPE_LABELS[result.primaryType];
  const explanation = TYPE_EXPLANATIONS[result.primaryType];

  return (
    <Layout step={6}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Badge label="Your nervous system pattern" color={typeColor} />
        <h2 style={{ fontSize: 32, fontWeight: 700, color: typeColor, marginTop: 12, marginBottom: 8 }}>{typeLabel}</h2>
        {result.secondaryType && (
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>
            Secondary pattern: <strong style={{ color: C.typeColors[result.secondaryType] }}>{TYPE_LABELS[result.secondaryType]}</strong>
          </div>
        )}
        <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 auto", maxWidth: 400 }}>
          This is an adaptive state, not a personal failure.
        </p>
      </div>

      {/* Type explanation */}
      <div style={{
        background: C.bgSurface, borderRadius: 12, padding: 20,
        border: `1px solid ${typeColor}33`, marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: typeColor, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          What this means:
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textPrimary, margin: 0 }}>{explanation}</p>
      </div>

      {/* Top symptoms */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Your strongest signals:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {result.topSymptoms.map((s, i) => (
            <Badge key={i} label={s} color={typeColor} />
          ))}
        </div>
      </div>

      {/* Score bars */}
      <div style={{ background: C.bgSurface, borderRadius: 12, padding: 20, marginBottom: 20, border: `1px solid ${C.borderDefault}` }}>
        {[
          ["Overstimulated", result.scores.overstimulatedScore, "Overstimulated"],
          ["Burned Out", result.scores.burnedOutScore, "BurnedOut"],
          ["Anxious", result.scores.anxiousScore, "Anxious"],
          ["In Recovery", result.scores.recoveryScore, "InRecovery"],
        ].map(([label, score, key]) => (
          <div key={String(key)} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: key === result.primaryType ? 700 : 400, color: key === result.primaryType ? C.typeColors[result.primaryType as NervousSystemType] : C.textSecondary }}>
                {String(label)}
              </span>
              <span style={{ fontSize: 12, color: C.textMuted }}>{String(score)}</span>
            </div>
            <div style={{ height: 6, background: C.bgMuted, borderRadius: 3 }}>
              <div style={{
                height: "100%", width: `${score}%`,
                background: key === result.primaryType ? C.typeColors[result.primaryType as NervousSystemType] : C.bgElevated,
                borderRadius: 3,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recommended protocol */}
      <div style={{
        background: C.bgElevated, borderRadius: 12, padding: 20,
        border: `1px solid ${C.borderActive}`, marginBottom: 32,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Your recommended starting track:
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textPrimary, margin: 0 }}>
          {result.recommendedProtocolTrack}
        </p>
      </div>

      <PrimaryButton onClick={onNext}>Start my plan →</PrimaryButton>
    </Layout>
  );
}

function CommitmentScreen({ onCommit, committing }: { onCommit: (startDate: string) => void; committing: boolean }) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [agreed, setAgreed] = useState(false);

  const todayLabel = new Date(startDate + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <Layout step={7}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.35, marginBottom: 16 }}>
          Ready to begin your 8-week restoration journey?
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary }}>
          {`Consistency is the mechanism. Small daily actions compound into regulation baseline change. You don't need to be perfect — you need to show up.`}
        </p>
      </div>

      {/* Start date */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: C.textPrimary }}>Your start date:</div>
        <div style={{ background: C.bgElevated, border: `1px solid ${C.borderDefault}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 15, color: C.textPrimary, marginBottom: 8 }}>Today — {todayLabel}</div>
          <input
            type="date"
            value={startDate}
            min={today}
            max={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })()}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              background: "transparent", border: "none", color: C.accent,
              fontSize: 13, cursor: "pointer", padding: 0,
            }}
          />
        </div>
      </div>

      {/* Opt-in */}
      <label style={{
        display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer",
        background: C.bgSurface, border: `1px solid ${agreed ? C.accent : C.borderDefault}`,
        borderRadius: 8, padding: 16, marginBottom: 32, transition: "border-color 200ms",
      }}>
        <div style={{
          flexShrink: 0, width: 20, height: 20, borderRadius: 4, marginTop: 2,
          border: `2px solid ${agreed ? C.accent : C.borderDefault}`,
          background: agreed ? C.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 200ms, border-color 200ms",
        }}>
          {agreed && <span style={{ color: "#000", fontSize: 12, fontWeight: 700 }}>✓</span>}
        </div>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary }}>
          I am committing to an 8-week restoration journey. I understand consistency matters more than perfection.
        </span>
      </label>

      <PrimaryButton onClick={() => onCommit(startDate)} disabled={!agreed || committing}>
        {committing ? "Setting up…" : "Begin Day 1 →"}
      </PrimaryButton>
    </Layout>
  );
}

function DayOneScreen({ onStart }: { onStart: () => void }) {
  const [missExpanded, setMissExpanded] = useState(false);

  const tasks = [
    { title: "Morning check-in", desc: "Log your focus, calm, energy", mins: "~3 min" },
    { title: "Protocol task 1", desc: "First daily action from your protocol", mins: "~8 min" },
    { title: "Evening reflection", desc: "Daily close-out note", mins: "~5 min" },
  ];

  return (
    <Layout step={8}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Badge label="Day 1 · Starting now" color={C.success} />
        <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, marginBottom: 12, lineHeight: 1.35 }}>
          {`Here's what your first day looks like.`}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary }}>
          Short, achievable, and done in under 20 minutes. Every task is explained — no guesswork.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {tasks.map((task) => (
          <div key={task.title} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: C.bgSurface, border: `1px solid ${C.borderDefault}`,
            borderRadius: 8, padding: "12px 16px",
          }}>
            <div style={{
              flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${C.borderDefault}`,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{task.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{task.desc}</div>
            </div>
            <div style={{ fontSize: 11, color: C.accent, fontFamily: "monospace", flexShrink: 0 }}>{task.mins}</div>
          </div>
        ))}
      </div>

      {/* What if I miss a day accordion */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => setMissExpanded((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
            color: C.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "8px 0",
          }}
        >
          <span>What if I miss a day?</span>
          <span style={{ transition: "transform 200ms", transform: missExpanded ? "rotate(90deg)" : "none" }}>›</span>
        </button>
        {missExpanded && (
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textSecondary, margin: "8px 0 0", paddingLeft: 4 }}>
            {`Missing one day doesn't reset your progress. Your streak pauses, not your restoration. Just continue the next day — no self-judgment.`}
          </p>
        )}
      </div>

      <PrimaryButton onClick={onStart}>Start Day 1</PrimaryButton>
    </Layout>
  );
}

// ─── Main orchestrator ───────────────────────────────────────────────────────

type Phase =
  | { kind: "welcome" }
  | { kind: "how-it-works"; substep: 1 | 2 | 3 }
  | { kind: "assessment"; questionIndex: number }
  | { kind: "results"; result: AssessmentResult }
  | { kind: "commitment"; result: AssessmentResult }
  | { kind: "day-one" };

export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "welcome" });
  const [responses, setResponses] = useState<Partial<AssessmentResponses>>({});
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load autosaved responses on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(AUTOSAVE_KEY);
      if (saved) setResponses(JSON.parse(saved));
    } catch {
      // ignore
    }
    // Check if assessment already done → skip to results
    getJson<{ result: AssessmentResult | null }>("/api/assessment")
      .then((data) => {
        if (data.result) {
          setPhase({ kind: "results", result: data.result });
        }
      })
      .catch(() => {});
  }, []);

  const autosave = useCallback((r: Partial<AssessmentResponses>) => {
    try { sessionStorage.setItem(AUTOSAVE_KEY, JSON.stringify(r)); } catch {}
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1500);
  }, []);

  function handleAnswer(value: number) {
    const q = phase.kind === "assessment" ? ASSESSMENT_QUESTIONS[phase.questionIndex] : null;
    if (!q) return;
    const key = `q${q.id}` as keyof AssessmentResponses;
    const isAlreadySelected = responses[key] === value;

    if (!isAlreadySelected) {
      // Save response
      const updated = { ...responses, [key]: value };
      setResponses(updated);
      autosave(updated);

      // Small delay so user can see selection, then advance
      setTimeout(() => {
        if (phase.kind !== "assessment") return;
        const nextIndex = phase.questionIndex + 1;
        if (nextIndex < TOTAL_QUESTIONS) {
          setPhase({ kind: "assessment", questionIndex: nextIndex });
        } else {
          handleSubmitAssessment({ ...updated } as AssessmentResponses);
        }
      }, 300);
    } else {
      // Already selected — advance manually
      if (phase.kind !== "assessment") return;
      const nextIndex = phase.questionIndex + 1;
      if (nextIndex < TOTAL_QUESTIONS) {
        setPhase({ kind: "assessment", questionIndex: nextIndex });
      } else {
        handleSubmitAssessment({ ...responses } as AssessmentResponses);
      }
    }
  }

  async function handleSubmitAssessment(finalResponses: AssessmentResponses) {
    setSubmitError(null);
    try {
      const data = await postJson<{ result: AssessmentResult }>("/api/assessment", { responses: finalResponses });
      try { sessionStorage.removeItem(AUTOSAVE_KEY); } catch {}
      setPhase({ kind: "results", result: data.result });
    } catch (err) {
      // Compute locally as fallback and show error
      const local = computeAssessment(finalResponses);
      setSubmitError((err as Error).message ?? "Couldn't save — you can still see your results.");
      setPhase({ kind: "results", result: local });
    }
  }

  async function handleCommit(startDate: string) {
    if (phase.kind !== "commitment") return;
    setCommitting(true);
    try {
      const result = phase.result;
      // Save onboarding answers and schedule email nurture sequence (both best-effort)
      await Promise.allSettled([
        postJson("/api/onboarding", {
          workRhythm: "assessment-driven",
          preferredTrainingWindow: startDate,
          overwhelmTriggers: [],
          focusFrictionPatterns: [],
        }),
        postJson("/api/onboarding/commit", {
          primaryType: TYPE_LABELS[result.primaryType],
          recommendedProtocol: result.recommendedProtocolTrack,
        }),
      ]);
      setPhase({ kind: "day-one" });
    } finally {
      setCommitting(false);
    }
  }

  // Back navigation
  function handleAssessmentBack() {
    if (phase.kind !== "assessment") return;
    if (phase.questionIndex > 0) {
      setPhase({ kind: "assessment", questionIndex: phase.questionIndex - 1 });
    } else {
      setPhase({ kind: "how-it-works", substep: 3 });
    }
  }

  if (phase.kind === "welcome") {
    return <WelcomeScreen onNext={() => setPhase({ kind: "how-it-works", substep: 1 })} />;
  }

  if (phase.kind === "how-it-works") {
    return (
      <HowItWorksScreen
        substep={phase.substep}
        onNext={() => {
          if (phase.substep < 3) {
            setPhase({ kind: "how-it-works", substep: (phase.substep + 1) as 1 | 2 | 3 });
          } else {
            setPhase({ kind: "assessment", questionIndex: 0 });
          }
        }}
        onBack={() => {
          if (phase.substep > 1) {
            setPhase({ kind: "how-it-works", substep: (phase.substep - 1) as 1 | 2 | 3 });
          } else {
            setPhase({ kind: "welcome" });
          }
        }}
      />
    );
  }

  if (phase.kind === "assessment") {
    return (
      <AssessmentScreen
        questionIndex={phase.questionIndex}
        responses={responses}
        onAnswer={handleAnswer}
        onBack={handleAssessmentBack}
        savedIndicator={savedIndicator}
      />
    );
  }

  if (phase.kind === "results") {
    return (
      <>
        {submitError && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99, padding: "12px 24px", background: `${C.error}1a`, color: C.error, fontSize: 13, textAlign: "center" }}>
            {submitError}
          </div>
        )}
        <ResultsScreen
          result={phase.result}
          onNext={() => setPhase({ kind: "commitment", result: phase.result })}
        />
      </>
    );
  }

  if (phase.kind === "commitment") {
    return <CommitmentScreen onCommit={handleCommit} committing={committing} />;
  }

  if (phase.kind === "day-one") {
    return <DayOneScreen onStart={() => router.push("/today")} />;
  }

  return null;
}
