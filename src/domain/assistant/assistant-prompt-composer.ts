import type { AssistantContext } from "@/domain/assistant/assistant-context-builder";

export type AssistantPromptPayload = {
  system: string;
  userContextBlock: string;
};

const SYSTEM_PROMPT =
  "You are the Neuroforge protocol assistant. You support protocol adherence, nervous system regulation, and safe behavioral progress. You do not modify protocols.";

export function composeAssistantPrompt(context: AssistantContext): AssistantPromptPayload {
  const lines: string[] = [];

  if (typeof context.protocolName === "string" && context.protocolName.length > 0) {
    lines.push(`Protocol: ${context.protocolName}`);
  }

  if (typeof context.protocolName === "string") {
    const name = context.protocolName.toLowerCase();

    if (name.includes("reset") || name.includes("recovery")) {
      lines.push("Protocol focus: recovery and nervous system stabilization — keep guidance gentle and regulation-first.");
    } else if (name.includes("build") || name.includes("performance")) {
      lines.push("Protocol focus: capacity building — encourage structured effort and consistency.");
    } else if (name.includes("focus") || name.includes("clarity")) {
      lines.push("Protocol focus: cognitive regulation — emphasize attention hygiene and task sequencing.");
    }
  }

  if (typeof context.isEnrolled === "boolean") {
    lines.push(`Enrolled: ${context.isEnrolled ? "yes" : "no"}`);
  }

  if (typeof context.phaseCount === "number") {
    lines.push(`Phases: ${context.phaseCount}`);
  }

  if (typeof context.totalDays === "number") {
    lines.push(`Total days: ${context.totalDays}`);
  }

  if (context.todayTaskTitles.length > 0) {
    lines.push("Today tasks:");
    lines.push(...context.todayTaskTitles.map((title) => `- ${title}`));
  }

  if (typeof context.streakCount === "number") {
    lines.push(`Streak: ${context.streakCount}`);
    if (context.streakCount >= 7) {
      lines.push("Streak status: strong consistency — reinforce momentum.");
    } else if (context.streakCount >= 3) {
      lines.push("Streak status: building consistency — encourage continuation.");
    } else if (context.streakCount === 0) {
      lines.push("Streak status: just restarted — emphasize small easy wins.");
    }
  }

  if (typeof context.todayTaskCount === "number") {
    lines.push(`Today task count: ${context.todayTaskCount}`);
  }

  if (typeof context.completedTaskCount === "number") {
    lines.push(`Completed today: ${context.completedTaskCount}`);
  }

  if (typeof context.todayPhaseName === "string" && context.todayPhaseName.length > 0) {
    lines.push(`Today phase: ${context.todayPhaseName}`);
  }

  if (typeof context.protocolProgressPercent === "number") {
    lines.push(`Progress: ${context.protocolProgressPercent}%`);
  }

  // Phase 5.1 — enhanced context
  if (typeof context.nervousSystemType === "string" && context.nervousSystemType.length > 0) {
    lines.push(`Nervous system type: ${context.nervousSystemType}`);
  }

  if (typeof context.avgFocus === "number" || typeof context.avgCalm === "number" || typeof context.avgEnergy === "number") {
    const parts: string[] = [];
    if (typeof context.avgFocus === "number") parts.push(`focus ${context.avgFocus}/10`);
    if (typeof context.avgCalm === "number") parts.push(`calm ${context.avgCalm}/10`);
    if (typeof context.avgEnergy === "number") parts.push(`energy ${context.avgEnergy}/10`);
    lines.push(`7-day check-in averages: ${parts.join(", ")}`);

    if (typeof context.avgCalm === "number" && context.avgCalm < 4) {
      lines.push("Note: User is reporting consistently low calm scores — prioritize grounding and de-escalation.");
    }
    if (typeof context.avgEnergy === "number" && context.avgEnergy < 4) {
      lines.push("Note: User has low energy scores — suggest restorative tasks, avoid demanding new commitments.");
    }
  }

  if (typeof context.recentCompletionRate === "number") {
    lines.push(`7-day task completion rate: ${context.recentCompletionRate}%`);
    if (context.recentCompletionRate < 50) {
      lines.push("Completion rate is low — focus on re-engagement with compassion, not pressure.");
    }
  }

  if (context.overstimulationFlag === true) {
    lines.push("Overstimulation flag: active — user may be overwhelmed; use grounding language and reduce cognitive load.");
  }

  if (typeof context.fatigueIndex === "number") {
    if (context.fatigueIndex > 0.7) {
      lines.push(`Fatigue index: high (${context.fatigueIndex}) — recommend lighter tasks and recovery focus.`);
    }
  }

  if (typeof context.improvementTrend === "string") {
    lines.push(`Improvement trend: ${context.improvementTrend}`);
    if (context.improvementTrend === "improving") {
      lines.push("Trend is improving — acknowledge progress and reinforce momentum.");
    } else if (context.improvementTrend === "regressing") {
      lines.push("Trend is regressing — respond with empathy and help user identify small recovery steps.");
    }
  }

  return {
    system: SYSTEM_PROMPT,
    userContextBlock: lines.join("\n")
  };
}
