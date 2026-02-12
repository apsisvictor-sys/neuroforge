import type { AssistantConversation, AssistantMessage } from "@/domain/entities/assistant";
import type { ConversationRepository } from "@/domain/repositories/conversation-repository";
import { createId } from "@/lib/ids/create-id";
import { getMemoryStore } from "./memory-store";

export class InMemoryConversationRepository implements ConversationRepository {
  async getOrCreateConversation(userId: string, protocolId: string): Promise<AssistantConversation> {
    const existing = getMemoryStore().conversations.find(
      (item) => item.userId === userId && item.protocolId === protocolId
    );

    if (existing) {
      return existing;
    }

    const created: AssistantConversation = {
      id: createId(),
      userId,
      protocolId,
      createdAt: new Date().toISOString()
    };

    getMemoryStore().conversations.push(created);
    return created;
  }

  async listMessages(conversationId: string): Promise<AssistantMessage[]> {
    return getMemoryStore().messages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }

  async addMessage(input: {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    inputTokens?: number;
    outputTokens?: number;
  }): Promise<AssistantMessage> {
    const message: AssistantMessage = {
      id: createId(),
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      createdAt: new Date().toISOString(),
      inputTokens: input.inputTokens ?? null,
      outputTokens: input.outputTokens ?? null
    };

    getMemoryStore().messages.push(message);
    return message;
  }
}
