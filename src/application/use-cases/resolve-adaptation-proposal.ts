import type { AdaptationRepository } from "@/domain/repositories/adaptation-repository";
import type { AdaptationProposal, ProposalStatus } from "@/domain/entities/adaptation";

type ResolveAdaptationProposalDeps = {
  proposalId: string;
  userId: string;
  resolution: "accepted" | "rejected";
  adaptationRepository: AdaptationRepository;
};

export async function resolveAdaptationProposal(
  deps: ResolveAdaptationProposalDeps
): Promise<AdaptationProposal | null> {
  const { proposalId, userId, resolution, adaptationRepository } = deps;

  const proposal = await adaptationRepository.getProposalById(proposalId);
  if (!proposal) return null;
  if (proposal.userId !== userId) return null;
  if (proposal.status !== "proposed") return null;

  const resolvedAt = new Date().toISOString();
  const status: ProposalStatus = resolution;
  await adaptationRepository.updateProposalStatus(proposalId, status, resolvedAt);

  return { ...proposal, status, resolvedAt };
}
