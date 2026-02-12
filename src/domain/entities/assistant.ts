import type { AssistantRole } from "@/domain/types/common";

export type AssistantConversation = {
  id: string;
  userId: string;
  protocolId: string;
  createdAt: string;
};

export type AssistantMessage = {
  id: string;
  conversationId: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
  inputTokens: number | null;
  outputTokens: number | null;
};
