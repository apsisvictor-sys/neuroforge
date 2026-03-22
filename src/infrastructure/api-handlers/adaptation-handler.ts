import type { NextRequest } from "next/server";
import { badRequest, ok, serverError, unauthorized } from "@/lib/api";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { evaluateAdaptationRules } from "@/application/use-cases/evaluate-adaptation-rules";
import { resolveAdaptationProposal } from "@/application/use-cases/resolve-adaptation-proposal";
import { randomUUID } from "node:crypto";

export type AdaptationRouteDeps = {
  requireUserId: typeof requireUserId;
  adaptationRepository: typeof repositories.adaptation;
  trackingRepository: typeof repositories.tracking;
  protocolRepository: typeof repositories.protocol;
  userStateRepository: typeof repositories.userState;
};

export const defaultAdaptationRouteDeps: AdaptationRouteDeps = {
  requireUserId,
  adaptationRepository: repositories.adaptation,
  trackingRepository: repositories.tracking,
  protocolRepository: repositories.protocol,
  userStateRepository: repositories.userState
};

export async function handleGetProposals(deps: AdaptationRouteDeps = defaultAdaptationRouteDeps) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const proposals = await deps.adaptationRepository.getProposals(auth.userId);
    return ok({ proposals });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleEvaluate(deps: AdaptationRouteDeps = defaultAdaptationRouteDeps) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const newProposals = await evaluateAdaptationRules({
      userId: auth.userId,
      trackingRepository: deps.trackingRepository,
      protocolRepository: deps.protocolRepository,
      userStateRepository: deps.userStateRepository,
      adaptationRepository: deps.adaptationRepository,
      generateId: () => randomUUID(),
      today: new Date()
    });

    return ok({ evaluated: true, newProposals });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleAcceptProposal(
  _request: NextRequest,
  params: { id: string },
  deps: AdaptationRouteDeps = defaultAdaptationRouteDeps
) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const proposal = await resolveAdaptationProposal({
      proposalId: params.id,
      userId: auth.userId,
      resolution: "accepted",
      adaptationRepository: deps.adaptationRepository
    });

    if (!proposal) {
      return badRequest("Proposal not found or already resolved");
    }

    return ok({ proposal });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleRejectProposal(
  _request: NextRequest,
  params: { id: string },
  deps: AdaptationRouteDeps = defaultAdaptationRouteDeps
) {
  try {
    const auth = await deps.requireUserId();
    if ("response" in auth) return auth.response;

    const proposal = await resolveAdaptationProposal({
      proposalId: params.id,
      userId: auth.userId,
      resolution: "rejected",
      adaptationRepository: deps.adaptationRepository
    });

    if (!proposal) {
      return badRequest("Proposal not found or already resolved");
    }

    return ok({ proposal });
  } catch (error) {
    return serverError(error);
  }
}
