import type { UserState } from "@/domain/entities/user-state";

export interface UserStateRepository {
  getState(userId: string): Promise<UserState | null>;
  saveState(state: UserState): Promise<void>;
}
