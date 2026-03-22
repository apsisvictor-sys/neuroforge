export type SupplementCategory =
  | "dopamine_precursor"
  | "adaptogen"
  | "mitochondrial_support"
  | "sleep_support"
  | "nervous_system_calming";

export type SupplementPhase = "stabilize" | "reset" | "rebuild" | "optimize";

export type EvidenceLevel = "foundational" | "emerging" | "limited";

export type SupplementStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

export type SupplementSource = {
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
};

export type PhaseAlignment = {
  phase: SupplementPhase;
  rationale: string;
};

export type Supplement = {
  id: string;
  slug: string;
  name: string;
  category: SupplementCategory;
  mechanismSummary: string;
  mechanismDetail: string;
  typicalUsageContext: string;
  timingNotes: string;
  safetyNotes: string[];
  contraindications: string[];
  doNotCombine: string[];
  phaseAlignment: PhaseAlignment[];
  evidenceLevel: EvidenceLevel;
  status: SupplementStatus;
  disclaimerVersion: string;
  reviewedAt: string;
  sources: SupplementSource[];
};

export type PhaseStackEntry = {
  supplementId: string;
  rationale: string;
  priority: number;
};

export type PhaseStack = {
  phase: SupplementPhase;
  focus: string;
  entries: PhaseStackEntry[];
};
