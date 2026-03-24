import type { AssistantContext } from "./assistant-context-builder.ts";
import { composeAssistantPrompt } from "./assistant-prompt-composer.ts";
import type { AssistantReplyMode } from "./assistant-reply-modes.ts";
import { getAssistantReplyTemplate } from "./assistant-reply-modes.ts";

export type AssistantFinalPrompt = {
  system: string;
  modeTemplate: string;
  contextBlock: string;
  combinedUserPrompt: string;
};

const STRUCTURED_JSON_OUTPUT_INSTRUCTION = [
  "Return ONLY valid JSON matching this exact shape:",
  "{",
  '  "mode": "encouragement" | "instruction" | "safety_refusal" | "escalation_guidance",',
  '  "message": string,',
  '  "bullets"?: string[],',
  '  "safetyFlag"?: "none" | "refusal" | "escalation"',
  "}",
  "Rules:",
  "- No extra keys",
  "- No markdown",
  "- No prose outside JSON",
  "- message must be non-empty string",
  "- bullets max 5 short strings"
].join("\n");

export function assembleAssistantPrompt(
  context: AssistantContext,
  mode: AssistantReplyMode
): AssistantFinalPrompt {
  const composed = composeAssistantPrompt(context);
  const modeTemplate = getAssistantReplyTemplate(mode);
  const promptParts = [modeTemplate];
  if (composed.userContextBlock.length > 0) {
    promptParts.push(composed.userContextBlock);
  }
  promptParts.push(STRUCTURED_JSON_OUTPUT_INSTRUCTION);

  return {
    system: composed.system,
    modeTemplate,
    contextBlock: composed.userContextBlock,
    combinedUserPrompt: promptParts.join("\n\n")
  };
}
