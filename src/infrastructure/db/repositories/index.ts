import { InMemoryAuthRepository } from "./in-memory-auth-repository";
import { InMemoryConversationRepository } from "./in-memory-conversation-repository";
import { InMemoryProtocolRepository } from "./in-memory-protocol-repository";
import { InMemoryTrackingRepository } from "./in-memory-tracking-repository";
import { InMemoryUserRepository } from "./in-memory-user-repository";

export const repositories = {
  auth: new InMemoryAuthRepository(),
  conversation: new InMemoryConversationRepository(),
  protocol: new InMemoryProtocolRepository(),
  tracking: new InMemoryTrackingRepository(),
  user: new InMemoryUserRepository()
};
