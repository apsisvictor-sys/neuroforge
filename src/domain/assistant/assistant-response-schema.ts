import type { AssistantReplyMode } from "./assistant-reply-modes.ts";

export type AssistantStructuredResponse = {
  mode: AssistantReplyMode;
  message: string;
  bullets?: string[];
  safetyFlag?: "none" | "refusal" | "escalation";
};

const REPLY_MODES: AssistantReplyMode[] = [
  "encouragement",
  "instruction",
  "safety_refusal",
  "escalation_guidance"
];

const SAFETY_FLAGS: Array<AssistantStructuredResponse["safetyFlag"]> = ["none", "refusal", "escalation"];

export function isAssistantStructuredResponse(x: unknown): x is AssistantStructuredResponse {
  if (typeof x !== "object" || x === null) {
    return false;
  }

  const candidate = x as {
    mode?: unknown;
    message?: unknown;
    bullets?: unknown;
    safetyFlag?: unknown;
  };

  if (typeof candidate.message !== "string" || candidate.message.trim().length === 0) {
    return false;
  }

  if (typeof candidate.mode !== "string" || !REPLY_MODES.includes(candidate.mode as AssistantReplyMode)) {
    return false;
  }

  if (typeof candidate.bullets !== "undefined") {
    if (!Array.isArray(candidate.bullets)) {
      return false;
    }
    if (!candidate.bullets.every((item) => typeof item === "string")) {
      return false;
    }
  }

  if (typeof candidate.safetyFlag !== "undefined") {
    if (typeof candidate.safetyFlag !== "string") {
      return false;
    }
    if (!SAFETY_FLAGS.includes(candidate.safetyFlag as AssistantStructuredResponse["safetyFlag"])) {
      return false;
    }
  }

  return true;
}
