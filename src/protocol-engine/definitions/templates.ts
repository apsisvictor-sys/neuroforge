import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const protocolTemplates: ProtocolTemplate[] = [
  {
    id: "protocol-core-reset-v1",
    slug: "core-reset",
    name: "Core Reset",
    description: "Daily regulation and focus restoration protocol for overstimulated operators.",
    version: 1,
    phases: [
      {
        id: "phase-stabilize",
        name: "Stabilize",
        dayRange: { startDay: 1, endDay: 7 },
        tasks: [
          {
            id: "task-breathing-3m",
            title: "3-minute downshift breathing",
            instructions: "Inhale 4s, exhale 6s, for 3 minutes.",
            category: "regulation",
            estimatedMinutes: 3,
            order: 1,
            required: true
          },
          {
            id: "task-priority-1",
            title: "Define one high-impact task",
            instructions: "Choose one outcome that matters most today and write it clearly.",
            category: "planning",
            estimatedMinutes: 5,
            order: 2,
            required: true
          },
          {
            id: "task-focus-sprint-25",
            title: "Single 25-minute focus sprint",
            instructions: "Work uninterrupted on your primary task for 25 minutes.",
            category: "focus",
            estimatedMinutes: 25,
            order: 3,
            required: true
          }
        ]
      },
      {
        id: "phase-build",
        name: "Build",
        dayRange: { startDay: 8, endDay: 30 },
        tasks: [
          {
            id: "task-breathing-5m",
            title: "5-minute regulation reset",
            instructions: "Use slow exhale breathing for 5 minutes before deep work.",
            category: "regulation",
            estimatedMinutes: 5,
            order: 1,
            required: true
          },
          {
            id: "task-deep-work-45",
            title: "45-minute deep work block",
            instructions: "Complete one uninterrupted 45-minute execution block.",
            category: "focus",
            estimatedMinutes: 45,
            order: 2,
            required: true
          },
          {
            id: "task-recovery-walk",
            title: "Recovery walk",
            instructions: "Take a 10-minute low-stimulation walk with no audio input.",
            category: "recovery",
            estimatedMinutes: 10,
            order: 3,
            required: false
          }
        ]
      }
    ]
  }
];
