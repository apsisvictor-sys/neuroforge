import type { AssistantContext } from "./assistant-context-builder.ts";
import type { AssistantReplyMode } from "./assistant-reply-modes.ts";

const DISTRESS_KEYWORDS = [
  "suicidal",
  "suicide",
  "kill myself",
  "self harm",
  "hurt myself",
  "panic attack",
  "can't go on",
  "emergency"
];

const UNSAFE_KEYWORDS = [
  "change the protocol",
  "override protocol",
  "ignore protocol",
  "medical advice",
  "diagnose me"
];

function includesAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

export function selectAssistantReplyMode(input: {
  context: AssistantContext;
  userText?: string | null;
}): AssistantReplyMode {
  const text = input.userText ?? "";

  if (text && includesAny(text, DISTRESS_KEYWORDS)) {
    return "escalation_guidance";
  }

  if (text && includesAny(text, UNSAFE_KEYWORDS)) {
    return "safety_refusal";
  }

  if (!input.context.isEnrolled || input.context.todayTaskTitles.length === 0) {
    return "encouragement";
  }

  return "instruction";
}
