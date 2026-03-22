import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const boxBreathingProtocol: ProtocolTemplate = {
  id: "protocol-box-breathing-v1",
  slug: "box-breathing",
  name: "Box Breathing Protocol",
  description:
    "Nervous System Regulation — Build a daily breathwork practice to activate the parasympathetic nervous system, reduce cortisol levels, and develop on-demand stress resilience.",
  version: 1,
  difficulty: "beginner",
  pillar: "Nervous System Regulation",
  scientificRationale: "Cyclic controlled breathing directly modulates autonomic nervous system state via vagal afferents, increasing heart rate variability (HRV) and shifting the ANS toward parasympathetic dominance. Consistent practice creates lasting structural changes in vagal tone, reducing baseline cortisol reactivity and improving stress recovery speed. Used pre-performance, it primes prefrontal cortex activity for higher executive function.",
  scienceSummary: "Controlled cyclic breathing activates vagal pathways, shifting the nervous system toward parasympathetic dominance and building stress resilience.",
  expectedOutcome: "On-demand stress recovery capability, reduced anxiety baseline, and improved cognitive clarity before high-stakes tasks.",
  prerequisites: [],
  phases: [
    {
      id: "phase-bb-foundation",
      name: "Foundation",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-bb-basic-box",
          title: "2-minute basic box breathing",
          instructions:
            "Inhale 4 counts, hold 4 counts, exhale 4 counts, hold 4 counts. Repeat for 2 minutes. Do this once, any time of day.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 1,
          required: true
        },
        {
          id: "task-bb-note-state",
          title: "Note state before and after",
          instructions:
            "Rate your tension or anxiety 1-10 before your breathing session and immediately after. Record both numbers.",
          category: "planning",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-bb-anchor-cue",
          title: "Choose a daily anchor cue",
          instructions:
            "Decide when you will do your box breathing each day (morning coffee, before first meeting, post-lunch). The cue is as important as the practice.",
          category: "planning",
          estimatedMinutes: 3,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-bb-expansion",
      name: "Expansion",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-bb-5min-session",
          title: "5-minute box breathing session",
          instructions:
            "Extend to 5 minutes at your anchor time. Maintain 4-4-4-4 counts. If distracted, gently return to the count without judgment.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-bb-pre-stress",
          title: "Apply before a high-stress moment",
          instructions:
            "Identify one stressful event today (meeting, call, decision). Do 6 box breaths before it. This is the practical application.",
          category: "regulation",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-bb-evening-wind",
          title: "Evening wind-down breathing",
          instructions: "2 minutes of box breathing as part of your pre-sleep routine to downregulate the nervous system.",
          category: "recovery",
          estimatedMinutes: 2,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-bb-deepening",
      name: "Deepening",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-bb-8min-session",
          title: "8-minute breathing session",
          instructions:
            "Extend morning session to 8 minutes. Experiment with 5-5-5-5 count if 4-4-4-4 feels too easy. Focus on smooth, full breath cycles.",
          category: "regulation",
          estimatedMinutes: 8,
          order: 1,
          required: true
        },
        {
          id: "task-bb-3x-daily",
          title: "Three practice moments",
          instructions:
            "Use box breathing at three distinct moments today: morning, before a stress point, and in the evening. This builds automaticity.",
          category: "regulation",
          estimatedMinutes: 10,
          order: 2,
          required: true
        },
        {
          id: "task-bb-focus-pre",
          title: "Breathwork before focus block",
          instructions: "3 minutes of box breathing before your deepest focus block of the day to prime cognitive clarity.",
          category: "focus",
          estimatedMinutes: 3,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-bb-integration",
      name: "Integration",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-bb-on-demand",
          title: "Deploy box breathing on demand",
          instructions:
            "Any time stress, anxiety, or overwhelm arises today, use box breathing as your first response tool before reacting.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-bb-morning-anchor",
          title: "Lock in morning anchor session",
          instructions:
            "Your daily 5-8 minute morning practice is now a permanent default. Confirm it completed today.",
          category: "regulation",
          estimatedMinutes: 8,
          order: 2,
          required: true
        },
        {
          id: "task-bb-progress-review",
          title: "Review baseline vs. current state ratings",
          instructions:
            "Compare your early before/after tension ratings with current ones. Note any consistent reduction in baseline anxiety.",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
