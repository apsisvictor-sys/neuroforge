import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const microAchievementTrackingProtocol: ProtocolTemplate = {
  id: "protocol-micro-achievement-tracking-v1",
  slug: "micro-achievement-tracking",
  name: "Micro-Achievement Tracking Protocol",
  description:
    "Behavioral Reward Rewiring — Rebuild motivational momentum by making small daily wins visible, reinforcing progress over perfection and rewiring the brain's reward prediction signal.",
  version: 1,
  difficulty: "beginner",
  pillar: "Behavioral Reward Rewiring",
  scientificRationale: "Dopaminergic reward circuits require concrete, time-bounded feedback loops to sustain motivation. Tracking micro-completions — small wins registered deliberately — activates the nucleus accumbens with task-outcome associations, building a reinforcement history that makes future task initiation easier. Without deliberate tracking, cognitive progress often goes unregistered and the motivational signal is lost.",
  scienceSummary: "Deliberate micro-win registration activates dopamine reward circuits and builds reinforcement history that sustains motivation.",
  expectedOutcome: "Stronger daily momentum, reduced mid-task dropout, and a measurable sense of progress that sustains effort over longer projects.",
  prerequisites: [],
  phases: [
    {
      id: "phase-mat-baseline",
      name: "Baseline",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-mat-log-3-wins",
          title: "Log 3 micro-wins",
          instructions:
            "At end of day, write 3 things you completed, moved forward, or did well — no matter how small. 'Sent the email' counts.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-mat-momentum-rating",
          title: "Rate daily momentum",
          instructions:
            "At day end, rate your sense of momentum (1-10). This is your baseline. Track it daily to see the trend.",
          category: "planning",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-mat-no-perfection",
          title: "Progress over perfection check",
          instructions:
            "Identify one thing you avoided starting because it felt too big. Write just the first 5-minute action you could take.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-mat-specificity",
      name: "Specificity",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-mat-categorize-wins",
          title: "Categorize wins by domain",
          instructions:
            "Label each micro-win: Work, Health, Relationships, or Learning. Categorization reveals where you're building and where you're stagnating.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-mat-morning-intent",
          title: "Set one micro-win intention at start of day",
          instructions:
            "In the morning, name one small win you intend to log by end of day. Intention narrows attention and increases completion rate.",
          category: "planning",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-mat-celebrate",
          title: "Acknowledge a win out loud or in writing",
          instructions:
            "For one of your wins today, explicitly acknowledge it — write a sentence of recognition, not just a bare log entry.",
          category: "recovery",
          estimatedMinutes: 3,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-mat-reflection",
      name: "Reflection",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-mat-weekly-review",
          title: "Weekly pattern review",
          instructions:
            "Review your 14 days of wins. What domains appear most? Where are gaps? What patterns do you notice about your productive days?",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-mat-momentum-trend",
          title: "Review momentum trend",
          instructions:
            "Plot your daily momentum scores from days 1-14. Is the trend upward? Identify the 3 highest-momentum days and what drove them.",
          category: "planning",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-mat-compound-win",
          title: "Identify a compound win",
          instructions:
            "Find one area where daily micro-wins have compounded into a visible larger outcome. Name the compound result explicitly.",
          category: "focus",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-mat-identity",
      name: "Identity",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-mat-identity-language",
          title: "Anchor wins to identity language",
          instructions:
            "Rewrite today's wins using identity framing: not 'I exercised' but 'I'm someone who moves every day.' Identity-based tracking builds durable habits.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-mat-permanent-log",
          title: "Commit to permanent daily win log",
          instructions:
            "The 3-win daily log is now a permanent practice. Confirm it completed today — this is a closing ritual, not a to-do list.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-mat-28day-review",
          title: "28-day momentum review",
          instructions:
            "Compare day 1 momentum score with today's. Write one sentence about how your relationship with progress has changed.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
