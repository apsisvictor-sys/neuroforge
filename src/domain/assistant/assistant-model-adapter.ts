import type { AssistantStructuredResponse } from "./assistant-response-schema.ts";

export type AssistantModelAdapter = {
  generateResponse(input: {
    system: string;
    userPrompt: string;
  }): Promise<AssistantStructuredResponse>;
};
