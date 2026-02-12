import { neuroforgeSystemPrompt } from "@/ai/prompts/neuroforge-system-prompt";
import type { LLMProvider } from "@/ai/providers/llm-provider";
import type { ConversationRepository } from "@/domain/repositories/conversation-repository";

export type AssistantContext = {
  userId: string;
  protocolId: string;
  phaseId: string;
  dayNumber: number;
  todayTasks: { title: string; completed: boolean }[];
  latestCheckin?: { focus: number; calm: number; energy: number };
};

export class NeuroforgeAssistantService {
  private readonly conversationRepository: ConversationRepository;
  private readonly provider: LLMProvider;

  constructor(conversationRepository: ConversationRepository, provider: LLMProvider) {
    this.conversationRepository = conversationRepository;
    this.provider = provider;
  }

  async reply(input: {
    userId: string;
    userMessage: string;
    context: AssistantContext;
  }): Promise<{ conversationId: string; message: string }> {
    const conversation = await this.conversationRepository.getOrCreateConversation(
      input.userId,
      input.context.protocolId
    );

    await this.conversationRepository.addMessage({
      conversationId: conversation.id,
      role: "user",
      content: input.userMessage
    });

    const history = await this.conversationRepository.listMessages(conversation.id);

    const contextMessage = {
      role: "user" as const,
      content: `Context: day ${input.context.dayNumber}, phase ${input.context.phaseId}, tasks ${JSON.stringify(
        input.context.todayTasks
      )}, checkin ${JSON.stringify(input.context.latestCheckin ?? null)}`
    };

    const model = await this.provider.sendChat({
      systemPrompt: neuroforgeSystemPrompt,
      temperature: 0.3,
      messages: [...history.map((item) => ({ role: item.role, content: item.content })), contextMessage]
    });

    await this.conversationRepository.addMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: model.content,
      inputTokens: model.usage?.inputTokens,
      outputTokens: model.usage?.outputTokens
    });

    return {
      conversationId: conversation.id,
      message: model.content
    };
  }
}
