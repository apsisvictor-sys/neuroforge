import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { computeAndSaveUserState } from "@/application/use-cases/compute-user-state";
import { ok, serverError, withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/users/me/state", "GET", async () => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    let state = await repositories.userState.getState(auth.userId);

    if (!state) {
      state = await computeAndSaveUserState({
        userId: auth.userId,
        userRepository: repositories.user,
        trackingRepository: repositories.tracking,
        protocolRepository: repositories.protocol,
        userStateRepository: repositories.userState
      });
    }

    return ok({ state });
  } catch (error) {
    return serverError(error);
  }
});
