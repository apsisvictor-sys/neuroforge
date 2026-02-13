import type { AssistantConversation, AssistantMessage } from "@/domain/entities/assistant";
import type { ConversationRepository } from "@/domain/repositories/conversation-repository";
import { createId } from "@/lib/ids/create-id";
import { prisma } from "@/infrastructure/db/prisma-client";

function mapConversation(row: {
  id: string;
  userId: string;
  protocolId: string;
  createdAt: Date;
}): AssistantConversation {
  return {
    id: row.id,
    userId: row.userId,
    protocolId: row.protocolId,
    createdAt: row.createdAt.toISOString()
  };
}

function mapMessage(row: {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  inputTokens: number | null;
  outputTokens: number | null;
}): AssistantMessage {
  return {
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
    inputTokens: row.inputTokens,
    outputTokens: row.outputTokens
  };
}

export class PrismaConversationRepository implements ConversationRepository {
  async getOrCreateConversation(userId: string, protocolId: string): Promise<AssistantConversation> {
    const existing = await prisma.conversation.findUnique({
      where: {
        userId_protocolId: {
          userId,
          protocolId
        }
      }
    });
    if (existing) {
      return mapConversation(existing);
    }

    const created = await prisma.conversation.create({
      data: {
        id: createId(),
        userId,
        protocolId
      }
    });

    return mapConversation(created);
  }

  async listMessages(conversationId: string): Promise<AssistantMessage[]> {
    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });

    return rows.map((row) =>
      mapMessage({
        id: row.id,
        conversationId: row.conversationId,
        role: row.role,
        content: row.content,
        createdAt: row.createdAt,
        inputTokens: row.inputTokens,
        outputTokens: row.outputTokens
      })
    );
  }

  async addMessage(input: {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    inputTokens?: number;
    outputTokens?: number;
  }): Promise<AssistantMessage> {
    const row = await prisma.message.create({
      data: {
        id: createId(),
        conversationId: input.conversationId,
        role: input.role,
        content: input.content,
        inputTokens: input.inputTokens ?? null,
        outputTokens: input.outputTokens ?? null
      }
    });

    return mapMessage({
      id: row.id,
      conversationId: row.conversationId,
      role: row.role,
      content: row.content,
      createdAt: row.createdAt,
      inputTokens: row.inputTokens,
      outputTokens: row.outputTokens
    });
  }
}
