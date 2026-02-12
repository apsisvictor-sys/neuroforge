export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type LLMResponse = {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
};

export interface LLMProvider {
  sendChat(input: {
    systemPrompt: string;
    messages: ChatMessage[];
    temperature: number;
  }): Promise<LLMResponse>;
}
