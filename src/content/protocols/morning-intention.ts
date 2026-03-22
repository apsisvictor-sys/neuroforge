import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const morningIntentionProtocol: ProtocolTemplate = {
  id: "protocol-morning-intention-v1",
  slug: "morning-intention",
  name: "Morning Intention Protocol",
  description:
    "Attention & Focus — Design each morning to prime cognitive direction, reduce decision fatigue, and set execution energy for the day through structured ritual and intentional planning.",
  version: 1,
  difficulty: "beginner",
  pillar: "Attention & Focus",
  scientificRationale: "The first 30–60 minutes of waking represent a neurochemically privileged window for intentional priming. Cortisol is peaking, hippocampal encoding is strongest, and the default mode network is transitioning from sleep-state activity. A structured morning intention practice — clarifying priority before stimulation input — leverages this window to anchor top-down attention control before reactive demands override it.",
  scienceSummary: "Morning intention setting leverages the cortisol peak and heightened hippocampal encoding to anchor daily priorities before reactive demands.",
  expectedOutcome: "Clearer daily priorities, reduced decision fatigue throughout the day, and stronger execution on high-value tasks.",
  prerequisites: [],
  phases: [
    {
      id: "phase-mi-ritual-setup",
      name: "Ritual Setup",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-mi-no-phone-60",
          title: "No-phone first 60 minutes",
          instructions:
            "Do not pick up your phone for the first 60 minutes after waking. This protects your attention from reactive mode before you've set your own direction.",
          category: "regulation",
          estimatedMinutes: 60,
          order: 1,
          required: true
        },
        {
          id: "task-mi-body-first",
          title: "Physical activation before screens",
          instructions:
            "Before any screen — including computer — do 5 minutes of physical movement: stretching, walking, or light exercise.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-mi-ritual-design",
          title: "Design your morning ritual sequence",
          instructions:
            "Write the exact sequence of your ideal morning: wake, light, movement, hydration, intention, work. You will iterate on this each week.",
          category: "planning",
          estimatedMinutes: 10,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-mi-intention-setting",
      name: "Intention Setting",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-mi-one-intention",
          title: "Write one clear daily intention",
          instructions:
            "Write one sentence: 'Today, the one thing that matters most is ___.' This is not a task list — it is a cognitive compass that filters all subsequent decisions.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-mi-intention-visible",
          title: "Keep intention visible",
          instructions:
            "Place your intention somewhere you will see it throughout the day: desktop wallpaper, sticky note, top of task list. Out of sight = out of mind.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-mi-first-task",
          title: "Begin intention-aligned task within 90 minutes of waking",
          instructions:
            "Your first focused work of the day should be directly related to your intention. No email, no admin — intention first.",
          category: "focus",
          estimatedMinutes: 25,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-mi-review-loop",
      name: "Review Loop",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-mi-morning-intention",
          title: "Set morning intention",
          instructions: "Write today's one-sentence intention before touching any reactive work (email, Slack, meetings).",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-mi-midday-check",
          title: "Midday intention check",
          instructions:
            "At noon, re-read your morning intention. Has the day drifted? If yes, redirect the next 2-hour block back toward it.",
          category: "regulation",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-mi-evening-review",
          title: "Evening intention review",
          instructions:
            "At end of day: did you accomplish your intention? Rate alignment 1-10. If low — was the intention wrong, or did the day hijack it?",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-mi-mastery",
      name: "Mastery",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-mi-full-ritual",
          title: "Execute full morning ritual",
          instructions:
            "Complete your full morning sequence — no-phone window, physical activation, intention — before engaging with any reactive communication.",
          category: "regulation",
          estimatedMinutes: 30,
          order: 1,
          required: true
        },
        {
          id: "task-mi-weekly-intention-theme",
          title: "Set a weekly intention theme",
          instructions:
            "In addition to daily intentions, define one overarching theme for this week. Daily intentions should map to the weekly theme.",
          category: "planning",
          estimatedMinutes: 10,
          order: 2,
          required: true
        },
        {
          id: "task-mi-ritual-refinement",
          title: "Refine ritual for peak output",
          instructions:
            "Review your 28 days of morning rituals. What element has the highest leverage? Optimize for that. Remove anything that added friction without value.",
          category: "planning",
          estimatedMinutes: 10,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
