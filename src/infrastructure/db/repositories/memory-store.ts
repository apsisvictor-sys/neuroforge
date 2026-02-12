import type { AssistantConversation, AssistantMessage } from "@/domain/entities/assistant";
import type { DailyTaskInstance, StreakState, UserProtocolEnrollment } from "@/domain/entities/protocol";
import type { DailyCheckin } from "@/domain/entities/tracking";
import type { User, UserProfile } from "@/domain/entities/user";

type MagicToken = {
  token: string;
  userId: string;
  email: string;
  expiresAt: string;
  consumed: boolean;
};

type Session = {
  token: string;
  userId: string;
  expiresAt: string;
};

type NonceRecord = {
  token: string;
  userId: string;
  expiresAt: string;
  used: boolean;
};

export type MemoryStore = {
  users: User[];
  profiles: UserProfile[];
  magicTokens: MagicToken[];
  sessions: Session[];
  nonces: NonceRecord[];
  enrollments: UserProtocolEnrollment[];
  dailyTasks: DailyTaskInstance[];
  streaks: StreakState[];
  checkins: DailyCheckin[];
  conversations: AssistantConversation[];
  messages: AssistantMessage[];
};

const store: MemoryStore = {
  users: [],
  profiles: [],
  magicTokens: [],
  sessions: [],
  nonces: [],
  enrollments: [],
  dailyTasks: [],
  streaks: [],
  checkins: [],
  conversations: [],
  messages: []
};

export function getMemoryStore(): MemoryStore {
  return store;
}
