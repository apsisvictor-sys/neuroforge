import type { AdaptationRepository } from "@/domain/repositories/adaptation-repository";
import type { AdaptationProposal, AdaptationRuleId, ProposalStatus } from "@/domain/entities/adaptation";

export class InMemoryAdaptationRepository implements AdaptationRepository {
  private proposals: Map<string, AdaptationProposal> = new Map();

  async getProposals(userId: string): Promise<AdaptationProposal[]> {
    return Array.from(this.proposals.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.proposedAt.localeCompare(a.proposedAt));
  }

  async getPendingProposals(userId: string): Promise<AdaptationProposal[]> {
    return Array.from(this.proposals.values()).filter(
      (p) => p.userId === userId && p.status === "proposed"
    );
  }

  async getPendingByRuleId(userId: string, ruleId: AdaptationRuleId): Promise<AdaptationProposal | null> {
    return (
      Array.from(this.proposals.values()).find(
        (p) => p.userId === userId && p.ruleId === ruleId && p.status === "proposed"
      ) ?? null
    );
  }

  async saveProposal(proposal: AdaptationProposal): Promise<void> {
    this.proposals.set(proposal.id, { ...proposal });
  }

  async updateProposalStatus(id: string, status: ProposalStatus, resolvedAt: string): Promise<void> {
    const proposal = this.proposals.get(id);
    if (!proposal) return;
    this.proposals.set(id, { ...proposal, status, resolvedAt });
  }

  async getProposalById(id: string): Promise<AdaptationProposal | null> {
    return this.proposals.get(id) ?? null;
  }
}
