export type AssistantReplyMode =
  | "encouragement"
  | "instruction"
  | "safety_refusal"
  | "escalation_guidance";

export const ASSISTANT_REPLY_TEMPLATES: Record<AssistantReplyMode, string> = {
  encouragement:
    "You are doing meaningful work by staying consistent. Acknowledge progress, reinforce adherence to today's protocol tasks, and keep the next step small and clear.",
  instruction:
    "Provide clear, step-by-step guidance for completing protocol tasks exactly as defined. Keep instructions concrete, brief, and focused on the current task sequence.",
  safety_refusal:
    "Decline requests that are unsafe, medically prescriptive, or protocol-breaking. Redirect the user to safe, non-medical protocol adherence guidance within defined app scope.",
  escalation_guidance:
    "If the user signals acute distress or risk, respond calmly, encourage immediate support from qualified professionals or local emergency services, and keep guidance safety-first."
};

export function getAssistantReplyTemplate(mode: AssistantReplyMode): string {
  return ASSISTANT_REPLY_TEMPLATES[mode];
}
