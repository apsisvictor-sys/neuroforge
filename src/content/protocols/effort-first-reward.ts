import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const effortFirstRewardProtocol: ProtocolTemplate = {
  id: "protocol-effort-first-reward-v1",
  slug: "effort-first-reward",
  name: "Effort-First Reward Protocol",
  description:
    "Behavioral Reward Rewiring — Reverse dopamine misfiring by ensuring effort and completion always precede reward, rebuilding intrinsic motivation and execution momentum.",
  version: 1,
  difficulty: "intermediate",
  pillar: "Behavioral Reward Rewiring",
  scientificRationale: "Dopamine is released in anticipation of effort, not just at reward delivery. Structuring effort before reward — work before entertainment, output before input — preserves the motivational salience of the reward and avoids the dopamine blunting caused by pre-reward consumption. This protocol rewires the behavioral schedule from passive reward-seeking to effort-first as the default operating pattern.",
  scienceSummary: "Effort-before-reward sequencing preserves dopamine anticipation and rebuilds intrinsic motivation through behavioral restructuring.",
  expectedOutcome: "Reduced procrastination, stronger initiation on important tasks, and greater intrinsic satisfaction from completed work.",
  prerequisites: [],
  phases: [
    {
      id: "phase-efr-awareness",
      name: "Awareness",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-efr-reward-map",
          title: "Map current reward-first patterns",
          instructions:
            "List 3 situations today where you rewarded yourself before effort (checked phone, got snack, browsed). No judgment — just observation.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-efr-one-task-first",
          title: "Complete one task before any reward",
          instructions:
            "Choose a single small task (15 minutes or less). Complete it fully before allowing yourself any reward — coffee, phone, snack.",
          category: "focus",
          estimatedMinutes: 15,
          order: 2,
          required: true
        },
        {
          id: "task-efr-satisfaction-note",
          title: "Note post-completion satisfaction",
          instructions:
            "After completing the task, rate your sense of satisfaction (1-10). This tracks whether the effort-first loop rebuilds intrinsic reward.",
          category: "planning",
          estimatedMinutes: 2,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-efr-delay",
      name: "Delay",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-efr-15min-effort",
          title: "15-minute effort block before any reward",
          instructions:
            "Insert a minimum 15-minute focused effort block before any reward (including morning coffee, phone, social media).",
          category: "focus",
          estimatedMinutes: 15,
          order: 1,
          required: true
        },
        {
          id: "task-efr-reward-defined",
          title: "Pre-define today's reward",
          instructions:
            "At the start of the day, name the reward you'll use as a completion incentive. Defined rewards are more motivating than spontaneous ones.",
          category: "planning",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-efr-no-pre-reward",
          title: "Catch and delay one pre-reward urge",
          instructions:
            "When you feel an urge for reward before completing work, pause and redirect to a small task instead. Log the instance.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-efr-reversal",
      name: "Reversal",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-efr-conditional-reward",
          title: "Make all major rewards conditional",
          instructions:
            "No major reward (meal out, entertainment, leisure) without completing the day's primary task first. This is the core habit reversal.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-efr-30min-block",
          title: "30-minute effort block as daily anchor",
          instructions:
            "Begin each day with a 30-minute focused work block before any dopamine-rich activity. This primes the effort-first loop.",
          category: "focus",
          estimatedMinutes: 30,
          order: 2,
          required: true
        },
        {
          id: "task-efr-tracking",
          title: "Track effort-first wins",
          instructions:
            "Log each day you successfully completed effort before reward. Seven consecutive days signals habit formation.",
          category: "planning",
          estimatedMinutes: 3,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-efr-reinforcement",
      name: "Reinforcement",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-efr-default-behavior",
          title: "Confirm effort-first as default behavior",
          instructions:
            "Effort-before-reward is now the default. Review: does it feel natural yet? Note any remaining friction points.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-efr-45min-morning",
          title: "45-minute morning effort block",
          instructions:
            "Extend morning effort block to 45 minutes. Protect this before email, social, or news consumption.",
          category: "focus",
          estimatedMinutes: 45,
          order: 2,
          required: true
        },
        {
          id: "task-efr-motivation-review",
          title: "Review satisfaction trajectory",
          instructions:
            "Compare your early satisfaction ratings with current ones. Rising scores indicate dopamine system repair.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
