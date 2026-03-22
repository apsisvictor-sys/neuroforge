export type AdaptationRuleId =
  | "fatigue-recovery-day"
  | "overstimulation-regulation-shift"
  | "compliance-difficulty-reduction"
  | "early-phase-advance";

export type ProposalStatus = "proposed" | "accepted" | "rejected";

export type AdaptationProposal = {
  id: string;
  userId: string;
  ruleId: AdaptationRuleId;
  reasoning: string;
  status: ProposalStatus;
  proposedAt: string; // ISO date string
  resolvedAt: string | null;
};
