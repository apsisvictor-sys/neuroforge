import type { AdaptationRepository } from "@/domain/repositories/adaptation-repository";
import type { AdaptationProposal, AdaptationRuleId, ProposalStatus } from "@/domain/entities/adaptation";
import { prisma } from "@/infrastructure/db/prisma-client";

function toProposal(row: {
  id: string;
  userId: string;
  ruleId: string;
  reasoning: string;
  status: string;
  proposedAt: Date;
  resolvedAt: Date | null;
}): AdaptationProposal {
  return {
    id: row.id,
    userId: row.userId,
    ruleId: row.ruleId as AdaptationRuleId,
    reasoning: row.reasoning,
    status: row.status as ProposalStatus,
    proposedAt: row.proposedAt.toISOString(),
    resolvedAt: row.resolvedAt ? row.resolvedAt.toISOString() : null
  };
}

export class PrismaAdaptationRepository implements AdaptationRepository {
  async getProposals(userId: string): Promise<AdaptationProposal[]> {
    const rows = await prisma.adaptationProposal.findMany({
      where: { userId },
      orderBy: { proposedAt: "desc" }
    });
    return rows.map(toProposal);
  }

  async getPendingProposals(userId: string): Promise<AdaptationProposal[]> {
    const rows = await prisma.adaptationProposal.findMany({
      where: { userId, status: "proposed" },
      orderBy: { proposedAt: "desc" }
    });
    return rows.map(toProposal);
  }

  async getPendingByRuleId(userId: string, ruleId: AdaptationRuleId): Promise<AdaptationProposal | null> {
    const row = await prisma.adaptationProposal.findFirst({
      where: { userId, ruleId, status: "proposed" }
    });
    return row ? toProposal(row) : null;
  }

  async saveProposal(proposal: AdaptationProposal): Promise<void> {
    await prisma.adaptationProposal.create({
      data: {
        id: proposal.id,
        userId: proposal.userId,
        ruleId: proposal.ruleId,
        reasoning: proposal.reasoning,
        status: proposal.status,
        proposedAt: new Date(proposal.proposedAt),
        resolvedAt: proposal.resolvedAt ? new Date(proposal.resolvedAt) : null
      }
    });
  }

  async updateProposalStatus(id: string, status: ProposalStatus, resolvedAt: string): Promise<void> {
    await prisma.adaptationProposal.update({
      where: { id },
      data: { status, resolvedAt: new Date(resolvedAt) }
    });
  }

  async getProposalById(id: string): Promise<AdaptationProposal | null> {
    const row = await prisma.adaptationProposal.findUnique({ where: { id } });
    return row ? toProposal(row) : null;
  }
}
