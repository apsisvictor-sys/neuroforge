import type { LLMProvider } from "@/ai/providers/llm-provider";
import { getEnv } from "@/infrastructure/config/env";

export class OpenAIProvider implements LLMProvider {
  async sendChat(input: {
    systemPrompt: string;
    messages: { role: "user" | "assistant"; content: string }[];
    temperature: number;
  }): Promise<{ content: string; usage?: { inputTokens: number; outputTokens: number } }> {
    const env = getEnv();

    if (!env.OPENAI_API_KEY) {
      return {
        content:
          "I can guide your protocol execution. Add OPENAI_API_KEY to enable live model responses."
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: input.temperature,
        messages: [
          { role: "system", content: input.systemPrompt },
          ...input.messages
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const payload = await response.json();
    return {
      content: payload.choices?.[0]?.message?.content ?? "",
      usage: payload.usage
        ? {
            inputTokens: payload.usage.prompt_tokens,
            outputTokens: payload.usage.completion_tokens
          }
        : undefined
    };
  }
}
