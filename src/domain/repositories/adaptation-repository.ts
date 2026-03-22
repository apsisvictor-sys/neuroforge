import type { AdaptationProposal, AdaptationRuleId, ProposalStatus } from "@/domain/entities/adaptation";

export interface AdaptationRepository {
  getProposals(userId: string): Promise<AdaptationProposal[]>;
  getPendingProposals(userId: string): Promise<AdaptationProposal[]>;
  getPendingByRuleId(userId: string, ruleId: AdaptationRuleId): Promise<AdaptationProposal | null>;
  saveProposal(proposal: AdaptationProposal): Promise<void>;
  updateProposalStatus(id: string, status: ProposalStatus, resolvedAt: string): Promise<void>;
  getProposalById(id: string): Promise<AdaptationProposal | null>;
}
