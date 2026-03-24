import type { AssistantModelAdapter } from "../../domain/assistant/assistant-model-adapter.ts";
import { OpenAIAssistantModelAdapter } from "./openai-assistant-model-adapter.ts";
import { StubAssistantModelAdapter } from "./stub-assistant-model-adapter.ts";

export function resolveAssistantModelAdapter(): AssistantModelAdapter {
  if (process.env.NEUROFORGE_ASSISTANT_MODEL === "openai") {
    return new OpenAIAssistantModelAdapter();
  }

  return new StubAssistantModelAdapter();
}
