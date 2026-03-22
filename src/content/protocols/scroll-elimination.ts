import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const scrollEliminationProtocol: ProtocolTemplate = {
  id: "protocol-scroll-elimination-v1",
  slug: "scroll-elimination",
  name: "Scroll Elimination Protocol",
  description:
    "Dopamine Reset — Break compulsive scrolling patterns by replacing passive consumption with intentional information intake and restoring voluntary attention control.",
  version: 1,
  difficulty: "beginner",
  pillar: "Dopamine Reset",
  scientificRationale: "Infinite scroll interfaces exploit variable-ratio reinforcement schedules — the same mechanism driving slot machine compulsion — which creates habitual checking patterns independent of genuine interest. Replacing scroll sessions with intentional content intake and installing behavioral friction at trigger points disrupts automaticity of the habit loop and reactivates voluntary attention control.",
  scienceSummary: "Behavioral friction and intentional replacement break scroll habit loops and reactivate voluntary attention control.",
  expectedOutcome: "Measurable reduction in daily scroll time, improved ability to sustain focus on a single task, and reduced post-scroll anxiety.",
  prerequisites: [],
  phases: [
    {
      id: "phase-se-audit",
      name: "Audit",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-se-trigger-log",
          title: "Log scroll triggers",
          instructions:
            "Each time you scroll today, pause and write what triggered it: boredom, anxiety, transition, habit. Aim for 3 logged instances.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-se-duration-estimate",
          title: "Estimate daily scroll time",
          instructions:
            "Check your device screen time for social and news apps. Write the total minutes consumed per day.",
          category: "planning",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-se-breathing",
          title: "Regulation breath before device pickup",
          instructions:
            "Any time you pick up your phone today, take 3 slow breaths first. This installs a pause between urge and action.",
          category: "regulation",
          estimatedMinutes: 3,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-se-interruption",
      name: "Interruption",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-se-friction",
          title: "Install friction at trigger points",
          instructions:
            "Delete or bury the top 2 scroll-trigger apps from your home screen. Add a 1-minute App Limit to each. Make the default action harder.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-se-no-scroll-window",
          title: "No-scroll morning window",
          instructions:
            "No scrolling for the first 60 minutes after waking. Phone can exist, but no feeds, no news, no social apps.",
          category: "regulation",
          estimatedMinutes: 60,
          order: 2,
          required: true
        },
        {
          id: "task-se-replacement",
          title: "Replace one scroll session with movement",
          instructions:
            "When you notice a scroll urge mid-day, replace it with 5 minutes of physical movement instead.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-se-replacement",
      name: "Replacement",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-se-intentional-reading",
          title: "Intentional reading session",
          instructions:
            "Replace one passive scroll session with 15 minutes of intentional reading (book, long-form article, essay). No feeds.",
          category: "focus",
          estimatedMinutes: 15,
          order: 1,
          required: true
        },
        {
          id: "task-se-designated-check",
          title: "Single designated check window",
          instructions:
            "Restrict all social and news consumption to one designated 15-minute window per day. Outside that window: no checking.",
          category: "regulation",
          estimatedMinutes: 15,
          order: 2,
          required: true
        },
        {
          id: "task-se-focus-sprint",
          title: "40-minute focus sprint",
          instructions: "Use energy previously spent on scrolling for a 40-minute uninterrupted focus block.",
          category: "focus",
          estimatedMinutes: 40,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-se-maintenance",
      name: "Maintenance",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-se-pattern-check",
          title: "Weekly scroll pattern review",
          instructions:
            "Check screen time data. Has total scroll time decreased? Identify if any new compulsive patterns emerged and adjust friction accordingly.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-se-no-scroll-anchor",
          title: "Maintain no-scroll morning window",
          instructions: "Extend the morning no-scroll window to 90 minutes. Protect this as a non-negotiable default.",
          category: "regulation",
          estimatedMinutes: 90,
          order: 2,
          required: true
        },
        {
          id: "task-se-deep-read",
          title: "30-minute deep reading",
          instructions: "Long-form reading session as the intentional replacement for former scrolling time.",
          category: "focus",
          estimatedMinutes: 30,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
