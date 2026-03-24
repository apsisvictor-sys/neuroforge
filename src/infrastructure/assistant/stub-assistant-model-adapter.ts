import type { AssistantModelAdapter } from "../../domain/assistant/assistant-model-adapter.ts";
import {
  isAssistantStructuredResponse,
  type AssistantStructuredResponse
} from "../../domain/assistant/assistant-response-schema.ts";

const STUB_RESPONSE: AssistantStructuredResponse = {
  mode: "instruction",
  message: "Stub model adapter response.",
  bullets: ["Stub action"],
  safetyFlag: "none"
};

export class StubAssistantModelAdapter implements AssistantModelAdapter {
  async generateResponse(_input: { system: string; userPrompt: string }): Promise<AssistantStructuredResponse> {
    if (!isAssistantStructuredResponse(STUB_RESPONSE)) {
      throw new Error("Invalid stub assistant response shape");
    }

    return STUB_RESPONSE;
  }
}
