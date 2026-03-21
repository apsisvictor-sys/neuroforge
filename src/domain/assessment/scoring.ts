import type {
  AssessmentResponses,
  AssessmentResult,
  AssessmentScores,
  NervousSystemType,
} from "./types";

// Weights: 3 = primary driver, 1 = secondary
// Each type has exactly 4 primary (weight 3) + 8 secondary (weight 1) = 20 total weight.
// Max possible score = 20 × 5 = 100, so the result is already 0–100.
const WEIGHTS: Record<NervousSystemType, Record<keyof AssessmentResponses, number>> = {
  Overstimulated: { q1:3, q2:1, q3:1, q4:1, q5:3, q6:1, q7:1, q8:1, q9:3, q10:3, q11:1, q12:1 },
  BurnedOut:      { q1:1, q2:3, q3:1, q4:3, q5:1, q6:3, q7:3, q8:1, q9:1, q10:1, q11:1, q12:1 },
  Anxious:        { q1:1, q2:1, q3:3, q4:3, q5:1, q6:1, q7:1, q8:3, q9:1, q10:3, q11:1, q12:1 },
  InRecovery:     { q1:1, q2:1, q3:1, q4:1, q5:1, q6:3, q7:3, q8:1, q9:1, q10:1, q11:3, q12:3 },
};

// Q4 (sleep) and Q12 (regulation baseline) are reverse-scored
const REVERSE_SCORED = new Set<keyof AssessmentResponses>(["q4", "q12"]);

const SYMPTOM_LABELS: Partial<Record<keyof AssessmentResponses, string>> = {
  q1: "Mental scattering / fragmented attention",
  q2: "Physical wired-but-tired pattern",
  q3: "Anxiety and anticipatory stress",
  q4: "Poor sleep restoration",
  q5: "Novelty-seeking / stimulation craving",
  q6: "Task initiation difficulty",
  q7: "Emotional flatness / reduced pleasure",
  q8: "Heightened stress sensitivity",
  q9: "High-stimulation screen exposure",
  q10: "Caffeine dependence",
  q11: "Recovery history factors",
  q12: "Low regulation baseline",
};

const RECOMMENDATIONS: Record<NervousSystemType, string> = {
  Overstimulated:
    "Dopamine Reset + screen-boundary protocol + morning downshift ritual",
  BurnedOut:
    "Sleep/circadian stabilization + low-load completion wins",
  Anxious:
    "Autonomic regulation stack (breath + somatic grounding) before cognitive load increase",
  InRecovery:
    "Structure-first consistency plan + trigger insulation + weekly safety review",
};

const TYPE_LABELS: Record<NervousSystemType, string> = {
  Overstimulated: "Overstimulated",
  BurnedOut: "Burned Out",
  Anxious: "Anxious",
  InRecovery: "In Recovery",
};

export { TYPE_LABELS, RECOMMENDATIONS };

function rawScore(responses: AssessmentResponses, q: keyof AssessmentResponses): number {
  const v = responses[q] ?? 1;
  return REVERSE_SCORED.has(q) ? 6 - v : v;
}

function computeTypeScore(
  responses: AssessmentResponses,
  typeWeights: Record<keyof AssessmentResponses, number>
): number {
  let total = 0;
  for (const [q, weight] of Object.entries(typeWeights) as [keyof AssessmentResponses, number][]) {
    total += rawScore(responses, q) * weight;
  }
  // Max possible = 100 (as explained in weight table above)
  return Math.round(total);
}

export function computeAssessment(responses: AssessmentResponses): AssessmentResult {
  const scores: AssessmentScores = {
    overstimulatedScore: computeTypeScore(responses, WEIGHTS.Overstimulated),
    burnedOutScore:      computeTypeScore(responses, WEIGHTS.BurnedOut),
    anxiousScore:        computeTypeScore(responses, WEIGHTS.Anxious),
    recoveryScore:       computeTypeScore(responses, WEIGHTS.InRecovery),
  };

  const typeScores: [NervousSystemType, number][] = (
    [
      ["Overstimulated", scores.overstimulatedScore],
      ["BurnedOut",      scores.burnedOutScore],
      ["Anxious",        scores.anxiousScore],
      ["InRecovery",     scores.recoveryScore],
    ] as [NervousSystemType, number][]
  ).sort((a, b) => b[1] - a[1]);

  const [first, second, third, fourth] = typeScores;
  const primaryType = first[0];
  const secondaryType = first[1] - second[1] < 8 ? second[0] : null;
  const meanOthers = (second[1] + third[1] + fourth[1]) / 3;
  const confidence = Math.round(first[1] - meanOthers);

  // Top 3 symptom drivers: primary questions for the winning type, sorted by raw response
  const primaryWeights = WEIGHTS[primaryType];
  const primaryQs = (
    Object.entries(primaryWeights) as [keyof AssessmentResponses, number][]
  )
    .filter(([, w]) => w === 3)
    .map(([q]) => q);

  const topSymptoms = primaryQs
    .map((q) => ({ q, score: rawScore(responses, q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ q }) => SYMPTOM_LABELS[q] ?? String(q));

  return {
    assessmentVersion: 1,
    submittedAt: new Date().toISOString(),
    responses,
    scores,
    primaryType,
    secondaryType,
    confidence,
    topSymptoms,
    recommendedProtocolTrack: RECOMMENDATIONS[primaryType],
  };
}
