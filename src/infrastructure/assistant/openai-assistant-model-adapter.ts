import type { AssistantModelAdapter } from "../../domain/assistant/assistant-model-adapter.ts";
import {
  isAssistantStructuredResponse,
  type AssistantStructuredResponse
} from "../../domain/assistant/assistant-response-schema.ts";
import { getEnv } from "../config/env.ts";

type OpenAIResponsesPayload = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

export class OpenAIAssistantModelAdapter implements AssistantModelAdapter {
  async generateResponse(input: {
    system: string;
    userPrompt: string;
  }): Promise<AssistantStructuredResponse> {
    const env = getEnv();

    if (!env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY for OpenAIAssistantModelAdapter");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: input.system },
          { role: "user", content: input.userPrompt }
        ],
        text: {
          format: {
            type: "json_object"
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI Responses API error: ${response.status}`);
    }

    const payload = (await response.json()) as OpenAIResponsesPayload;
    const text =
      payload.output_text ??
      payload.output?.[0]?.content?.find((item) => item.type === "output_text")?.text ??
      payload.output?.[0]?.content?.[0]?.text;

    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("OpenAI assistant response did not include text output");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("OpenAI assistant response was not valid JSON");
    }

    if (!isAssistantStructuredResponse(parsed)) {
      throw new Error("OpenAI assistant response failed schema validation");
    }

    return parsed;
  }
}
