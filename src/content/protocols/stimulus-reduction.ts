import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const stimulusReductionProtocol: ProtocolTemplate = {
  id: "protocol-stimulus-reduction-v1",
  slug: "stimulus-reduction",
  name: "Stimulus Reduction Protocol",
  description:
    "Dopamine Reset — Systematically reduce non-essential digital and sensory inputs to restore baseline dopamine sensitivity and reduce cognitive noise.",
  version: 1,
  difficulty: "beginner",
  pillar: "Dopamine Reset",
  scientificRationale: "High-frequency digital input creates chronic tonic dopamine elevation, which downregulates D2 receptor density and raises the stimulation threshold required for reward and pleasure. Progressive reduction of non-essential stimuli allows receptor upregulation and restores natural motivation signaling within 3–4 weeks, improving voluntary attention and reducing compulsive information-seeking.",
  scienceSummary: "Reducing non-essential digital inputs allows dopamine receptor upregulation and restores natural reward signaling.",
  expectedOutcome: "Wider voluntary attention span, reduced craving for digital stimulation, and renewed capacity for satisfaction from low-stimulation activities.",
  prerequisites: [],
  phases: [
    {
      id: "phase-sr-awareness",
      name: "Awareness",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-sr-audit",
          title: "Stimulus audit",
          instructions:
            "List every digital and environmental input you consumed in the last 24 hours. Note which felt compulsive vs. intentional.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-sr-urge-log",
          title: "Log one urge without acting on it",
          instructions:
            "Notice a stimulus urge (check phone, open social media). Write it down without acting. This is the full task.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-sr-quiet-10",
          title: "10-minute stimulus-free window",
          instructions:
            "Sit in a quiet environment with no screens, music, or podcasts for 10 minutes. No tasks — just observe your baseline state.",
          category: "recovery",
          estimatedMinutes: 10,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-sr-reduction",
      name: "Reduction",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-sr-eliminate-source",
          title: "Eliminate one non-essential stimulus source",
          instructions:
            "Choose one compulsive input from your audit (news feed, app, notification channel) and remove or block it today.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-sr-quiet-20",
          title: "20-minute low-stimulation block",
          instructions:
            "Spend 20 minutes in a low-input environment. Walking, stretching, or sitting in silence all count.",
          category: "recovery",
          estimatedMinutes: 20,
          order: 2,
          required: true
        },
        {
          id: "task-sr-output-first",
          title: "Output before input",
          instructions:
            "Complete your first focused task of the day before consuming any media, news, or social content.",
          category: "focus",
          estimatedMinutes: 30,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-sr-stabilization",
      name: "Stabilization",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-sr-hold-check",
          title: "Hold the reduced input environment",
          instructions:
            "Confirm that previously eliminated sources are still removed. If any crept back, remove them again and note the trigger.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-sr-quiet-30",
          title: "30-minute stimulus-free period",
          instructions:
            "A protected 30-minute window with no screens, no audio content, no news. Use it for reflection, journaling, or physical movement.",
          category: "recovery",
          estimatedMinutes: 30,
          order: 2,
          required: true
        },
        {
          id: "task-sr-focus-block",
          title: "Single 45-minute focus block",
          instructions: "Work on one task for 45 uninterrupted minutes in the reduced-stimulation environment.",
          category: "focus",
          estimatedMinutes: 45,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-sr-integration",
      name: "Integration",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-sr-selective-rules",
          title: "Define selective engagement rules",
          instructions:
            "Write 3 rules for intentional stimulus intake going forward. Example: only check news once per day at noon.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-sr-quiet-anchor",
          title: "Daily quiet anchor",
          instructions:
            "Complete your 30-minute stimulus-free window at the same time each day to anchor the habit.",
          category: "regulation",
          estimatedMinutes: 30,
          order: 2,
          required: true
        },
        {
          id: "task-sr-deep-work",
          title: "60-minute deep work block",
          instructions: "One 60-minute uninterrupted execution block in a low-stimulation environment.",
          category: "focus",
          estimatedMinutes: 60,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
