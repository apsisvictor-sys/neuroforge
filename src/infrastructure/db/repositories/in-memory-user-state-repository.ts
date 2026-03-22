import type { UserState } from "../../../domain/entities/user-state.ts";
import type { UserStateRepository } from "../../../domain/repositories/user-state-repository.ts";

export class InMemoryUserStateRepository implements UserStateRepository {
  private readonly store = new Map<string, UserState>();

  async getState(userId: string): Promise<UserState | null> {
    return this.store.get(userId) ?? null;
  }

  async saveState(state: UserState): Promise<void> {
    this.store.set(state.userId, state);
  }
}
