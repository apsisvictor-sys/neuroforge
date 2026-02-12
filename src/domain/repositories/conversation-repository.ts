import type { AssistantConversation, AssistantMessage } from "@/domain/entities/assistant";
import type { AssistantRole } from "@/domain/types/common";

export interface ConversationRepository {
  getOrCreateConversation(userId: string, protocolId: string): Promise<AssistantConversation>;
  listMessages(conversationId: string): Promise<AssistantMessage[]>;
  addMessage(input: {
    conversationId: string;
    role: AssistantRole;
    content: string;
    inputTokens?: number;
    outputTokens?: number;
  }): Promise<AssistantMessage>;
}
