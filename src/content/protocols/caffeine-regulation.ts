import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const caffeineRegulationProtocol: ProtocolTemplate = {
  id: "protocol-caffeine-regulation-v1",
  slug: "caffeine-regulation",
  name: "Caffeine Regulation Protocol",
  description:
    "Neurochemical Support — Optimize caffeine intake to eliminate dependency crashes, restore natural energy rhythms, and protect adenosine recycling cycles for sustained alertness.",
  version: 1,
  difficulty: "beginner",
  pillar: "Neurochemical Support",
  scientificRationale: "Caffeine blocks adenosine receptors rather than clearing adenosine, meaning sleep debt accumulates regardless of perceived alertness. Early morning caffeine use disrupts the natural cortisol peak (6–9am), and afternoon intake suppresses slow-wave sleep architecture. Strategic caffeine timing — delayed 90 minutes post-waking and cut off before 1pm — maximizes alertness benefits while preserving sleep quality.",
  scienceSummary: "Strategic caffeine timing preserves sleep architecture and maximizes alertness without disrupting natural cortisol rhythms.",
  expectedOutcome: "Elimination of afternoon energy crashes, improved sleep depth, and sustained natural energy levels throughout the day.",
  prerequisites: [],
  phases: [
    {
      id: "phase-cr-audit",
      name: "Audit",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-cr-intake-log",
          title: "Log all caffeine intake",
          instructions:
            "Record every caffeinated drink: time, amount, and how you felt 1 hour later. Include coffee, tea, energy drinks, pre-workouts.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-cr-crash-note",
          title: "Note afternoon energy crash",
          instructions:
            "At 3pm, rate your energy 1-10. Note whether you craved caffeine and whether you acted on it.",
          category: "planning",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-cr-morning-no-rush",
          title: "Delay first caffeine by 15 minutes",
          instructions:
            "Push your first caffeine intake 15 minutes later than usual. This is the entry point for reprogramming the adenosine cycle.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-cr-delay",
      name: "Morning Delay",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-cr-90min-delay",
          title: "First caffeine at 90 minutes after waking",
          instructions:
            "Wait 90 minutes after waking before your first caffeine. Cortisol peaks in this window — caffeine here disrupts natural alertness and builds dependency.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-cr-water-first",
          title: "Hydrate before caffeinating",
          instructions: "Drink 500ml of water before your first coffee or tea each morning.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-cr-cutoff-2pm",
          title: "Hard caffeine cutoff at 2pm",
          instructions:
            "No caffeine after 2pm. With a 5-7 hour half-life, this protects your sleep architecture. Evening tiredness is adenosine doing its job.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-cr-reduction",
      name: "Dose Reduction",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-cr-dose-down",
          title: "Reduce daily dose by 25%",
          instructions:
            "Cut your total daily caffeine by approximately 25% vs. your audit baseline. Reduce cup size or switch one coffee to half-caf.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-cr-energy-check",
          title: "Midday energy rating",
          instructions:
            "Rate your energy at noon and 3pm (1-10). Track whether natural energy is stabilizing as dependency decreases.",
          category: "planning",
          estimatedMinutes: 3,
          order: 2,
          required: true
        },
        {
          id: "task-cr-replacement-walk",
          title: "Replace one caffeine dose with movement",
          instructions:
            "Replace one afternoon caffeine hit with a 10-minute brisk walk. Physical movement raises norepinephrine without disrupting sleep.",
          category: "recovery",
          estimatedMinutes: 10,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-cr-calibration",
      name: "Calibration",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-cr-sustainable-schedule",
          title: "Define sustainable caffeine schedule",
          instructions:
            "Write your permanent caffeine protocol: timing windows, max daily dose, cutoff time. This is your new default.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-cr-90min-lock",
          title: "Lock in 90-minute morning delay",
          instructions: "The 90-minute delay after waking is now a permanent default. Confirm it held today.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-cr-crash-gone",
          title: "Confirm crash pattern eliminated",
          instructions:
            "Rate 3pm energy for the last 7 days. If the crash is gone, the adenosine cycle has been restored. Note the result.",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
