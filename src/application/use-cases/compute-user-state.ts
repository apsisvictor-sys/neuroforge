import type { UserRepository } from "@/domain/repositories/user-repository";
import type { TrackingRepository } from "@/domain/repositories/tracking-repository";
import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";
import type { UserStateRepository } from "@/domain/repositories/user-state-repository";
import type { UserState } from "@/domain/entities/user-state";
import { computeUserState } from "@/domain/entities/user-state";

type ComputeUserStateDeps = {
  userId: string;
  userRepository: UserRepository;
  trackingRepository: TrackingRepository;
  protocolRepository: ProtocolRepository;
  userStateRepository: UserStateRepository;
};

export async function computeAndSaveUserState(deps: ComputeUserStateDeps): Promise<UserState> {
  const { userId, userRepository, trackingRepository, protocolRepository, userStateRepository } = deps;

  const checkins = await trackingRepository.getHistory(userId, 14);
  const completionSummaries = await protocolRepository.getDailyCompletionSummaries(userId, 14);

  const profile = await userRepository.getProfile(userId);
  const nervousSystemType = profile?.onboardingAnswers?.assessment?.primaryType ?? null;

  const state = computeUserState(userId, checkins, completionSummaries, nervousSystemType);
  await userStateRepository.saveState(state);
  return state;
}
