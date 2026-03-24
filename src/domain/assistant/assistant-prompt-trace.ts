import type { AssistantReplyMode } from "./assistant-reply-modes.ts";

export type AssistantPromptTrace = {
  mode: AssistantReplyMode;
  systemLength: number;
  templateLength: number;
  contextLength: number;
};
