import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const deepWorkBlocksProtocol: ProtocolTemplate = {
  id: "protocol-deep-work-blocks-v1",
  slug: "deep-work-blocks",
  name: "Deep Work Blocks Protocol",
  description:
    "Attention & Focus — Train distraction-free sustained attention through progressive focus blocks, building cognitive depth and execution capacity week over week.",
  version: 1,
  difficulty: "intermediate",
  pillar: "Attention & Focus",
  scientificRationale: "The brain requires approximately 23 minutes to re-enter deep focus after an interruption, due to attentional residue — the cognitive load of a previous context persisting in working memory. Structured deep work blocks create protected windows allowing full attentional immersion, progressively rebuilding sustained single-task concentration capacity that is eroded by fragmented, interruption-driven work patterns.",
  scienceSummary: "Protected deep work blocks rebuild extended concentration capacity degraded by interruption-driven work patterns.",
  expectedOutcome: "Measurable increase in sustained focus duration, higher-quality work output per session, and reduced end-of-day cognitive fatigue.",
  prerequisites: [],
  phases: [
    {
      id: "phase-dwb-foundation",
      name: "Foundation 25m",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-dwb-define-task",
          title: "Define one deep work task",
          instructions:
            "Before sitting down, write the exact output you will produce in your focus block. Vague intentions reduce quality — be specific.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-dwb-25min-block",
          title: "25-minute deep work block",
          instructions:
            "Phone out of sight, notifications off, one tab or document open. Work on only the defined task for 25 uninterrupted minutes.",
          category: "focus",
          estimatedMinutes: 25,
          order: 2,
          required: true
        },
        {
          id: "task-dwb-distraction-log",
          title: "Log distractions",
          instructions:
            "Immediately after the block, write any distractions that pulled at you (internal or external). This data shapes your environment.",
          category: "planning",
          estimatedMinutes: 3,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-dwb-extension",
      name: "Extension 45m",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-dwb-environment-setup",
          title: "Set up deep work environment",
          instructions:
            "Address the top 2 distractions from your log: close apps, use website blocker, put phone in another room, silence notifications.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-dwb-45min-block",
          title: "45-minute deep work block",
          instructions: "Extend to a 45-minute uninterrupted focus block. Same rules: one task, one tool, no distractions.",
          category: "focus",
          estimatedMinutes: 45,
          order: 2,
          required: true
        },
        {
          id: "task-dwb-output-review",
          title: "Output quality check",
          instructions:
            "At the end of the block, rate the quality of work produced (1-10). Are you producing better output in 45 minutes than you would in 2 fragmented hours?",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-dwb-depth",
      name: "Depth 90m",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-dwb-pre-breathe",
          title: "Pre-block breathing ritual",
          instructions:
            "5 slow breaths before starting your 90-minute block. This is a physiological on-ramp — it signals the brain to shift into sustained attention mode.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 1,
          required: true
        },
        {
          id: "task-dwb-90min-block",
          title: "90-minute deep work block",
          instructions:
            "One 90-minute uninterrupted block. The first 15 minutes are ramp-up — resistance is normal. The depth emerges after the threshold.",
          category: "focus",
          estimatedMinutes: 90,
          order: 2,
          required: true
        },
        {
          id: "task-dwb-recovery",
          title: "15-minute recovery after block",
          instructions:
            "Walk, stretch, or sit quietly for 15 minutes post-block. Cognitive resources need active recovery — this is not optional laziness.",
          category: "recovery",
          estimatedMinutes: 15,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-dwb-capacity",
      name: "Full Capacity",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-dwb-schedule-blocks",
          title: "Schedule two deep work blocks",
          instructions:
            "Block two 90-minute focus windows in your calendar for today. Treat them as fixed appointments — no meetings, no interruptions.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-dwb-first-90",
          title: "First 90-minute deep work block",
          instructions: "Morning 90-minute block. Highest cognitive priority task. No email or communication beforehand.",
          category: "focus",
          estimatedMinutes: 90,
          order: 2,
          required: true
        },
        {
          id: "task-dwb-second-90",
          title: "Second 90-minute deep work block",
          instructions:
            "Afternoon 90-minute block after a recovery break. Two blocks of real depth per day is a professional superpower.",
          category: "focus",
          estimatedMinutes: 90,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
