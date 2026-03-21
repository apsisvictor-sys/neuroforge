export type NervousSystemType =
  | "Overstimulated"
  | "BurnedOut"
  | "Anxious"
  | "InRecovery";

export type AssessmentResponses = {
  q1: number; q2: number; q3: number; q4: number;
  q5: number; q6: number; q7: number; q8: number;
  q9: number; q10: number; q11: number; q12: number;
};

export type AssessmentScores = {
  overstimulatedScore: number;
  burnedOutScore: number;
  anxiousScore: number;
  recoveryScore: number;
};

export type AssessmentResult = {
  assessmentVersion: 1;
  submittedAt: string;
  responses: AssessmentResponses;
  scores: AssessmentScores;
  primaryType: NervousSystemType;
  secondaryType: NervousSystemType | null;
  confidence: number;
  topSymptoms: string[];
  recommendedProtocolTrack: string;
};

export type AssessmentQuestion = {
  id: number;
  text: string;
  options: { label: string; value: number }[];
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    text: "How often do you feel mentally scattered during focused work?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 2,
    text: "How often do you feel physically wired but mentally exhausted?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 3,
    text: "How often does anxiety or anticipatory stress disrupt your focus?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 4,
    text: "How restorative has your sleep been over the last 7 days?",
    options: [
      { label: "Very restorative", value: 1 },
      { label: "Mostly restorative", value: 2 },
      { label: "Somewhat restorative", value: 3 },
      { label: "Rarely restorative", value: 4 },
      { label: "Not at all restorative", value: 5 },
    ],
  },
  {
    id: 5,
    text: "How often do you crave quick stimulation (scrolling, switching apps, novelty)?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 6,
    text: "How difficult is it to start meaningful tasks without external pressure?",
    options: [
      { label: "Not difficult", value: 1 },
      { label: "Slightly difficult", value: 2 },
      { label: "Moderately difficult", value: 3 },
      { label: "Very difficult", value: 4 },
      { label: "Extremely difficult", value: 5 },
    ],
  },
  {
    id: 7,
    text: "How frequently do you experience emotional flatness or reduced pleasure?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 8,
    text: "How often do small stressors feel disproportionately intense?",
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Almost always", value: 5 },
    ],
  },
  {
    id: 9,
    text: "Daily high-stimulation screen exposure (non-work):",
    options: [
      { label: "< 1 hour", value: 1 },
      { label: "1–2 hours", value: 2 },
      { label: "2–4 hours", value: 3 },
      { label: "4–6 hours", value: 4 },
      { label: "> 6 hours", value: 5 },
    ],
  },
  {
    id: 10,
    text: "Caffeine dependence for baseline functioning:",
    options: [
      { label: "None", value: 1 },
      { label: "Low", value: 2 },
      { label: "Moderate", value: 3 },
      { label: "High", value: 4 },
      { label: "Very high", value: 5 },
    ],
  },
  {
    id: 11,
    text: "Recovery history (substance/behavioral overuse in last 24 months):",
    options: [
      { label: "No history", value: 1 },
      { label: "Resolved history", value: 2 },
      { label: "Mild ongoing", value: 3 },
      { label: "Moderate ongoing", value: 4 },
      { label: "Active recovery", value: 5 },
    ],
  },
  {
    id: 12,
    text: "Weekly regulation baseline (breathwork, movement, downshift rituals):",
    options: [
      { label: "Consistent", value: 1 },
      { label: "Frequent", value: 2 },
      { label: "Occasional", value: 3 },
      { label: "Rare", value: 4 },
      { label: "None", value: 5 },
    ],
  },
];
