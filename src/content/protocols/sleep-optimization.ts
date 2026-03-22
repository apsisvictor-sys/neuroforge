import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const sleepOptimizationProtocol: ProtocolTemplate = {
  id: "protocol-sleep-optimization-v1",
  slug: "sleep-optimization",
  name: "Sleep Optimization Protocol",
  description:
    "Neurochemical Support — Rebuild sleep architecture to support neurochemical recovery, cognitive performance, and nervous system regulation through consistent sleep-wake timing and stimulus reduction.",
  version: 1,
  difficulty: "beginner",
  pillar: "Neurochemical Support",
  scientificRationale: "Sleep is the primary mechanism for adenosine clearance, glymphatic waste removal, and neurochemical recycling. Consistent sleep-wake timing anchors the circadian clock via the suprachiasmatic nucleus, optimizing cortisol and melatonin rhythms. Even mild sleep restriction of 1–2 hours cumulatively impairs cognitive performance equivalent to full sleep deprivation within 10 days.",
  scienceSummary: "Consistent sleep timing anchors circadian rhythms and optimizes cortisol, melatonin, and neurochemical recycling cycles.",
  expectedOutcome: "Improved morning alertness, reduced daytime cognitive fatigue, and enhanced emotional regulation after 14–21 days of protocol adherence.",
  prerequisites: [],
  phases: [
    {
      id: "phase-so-baseline",
      name: "Baseline",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-so-sleep-log",
          title: "Log sleep time and quality",
          instructions:
            "Record your bedtime, wake time, and a 1-10 quality rating each morning. Note what you did in the last hour before bed.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-so-no-screens-30",
          title: "No screens 30 minutes before bed",
          instructions:
            "Turn off all screens at least 30 minutes before your target sleep time. Replace with reading, stretching, or breathing.",
          category: "regulation",
          estimatedMinutes: 30,
          order: 2,
          required: true
        },
        {
          id: "task-so-morning-light",
          title: "Morning light exposure",
          instructions:
            "Get natural light exposure within 30 minutes of waking — ideally outside for 5-10 minutes. This anchors your circadian clock.",
          category: "recovery",
          estimatedMinutes: 10,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-so-wind-down",
      name: "Wind-Down Routine",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-so-wind-down-routine",
          title: "Install 30-minute wind-down routine",
          instructions:
            "Design and execute a fixed pre-sleep routine: dim lights, light stretching, breathwork or journaling. Run it at the same time nightly.",
          category: "regulation",
          estimatedMinutes: 30,
          order: 1,
          required: true
        },
        {
          id: "task-so-fixed-wake",
          title: "Fixed wake time",
          instructions:
            "Set a consistent wake time and hold it regardless of what time you fell asleep. Sleep pressure builds and timing stabilizes.",
          category: "planning",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-so-cool-room",
          title: "Cool sleep environment",
          instructions:
            "Lower room temperature to 16-19°C (61-67°F) before bed. Core body temperature drop is a key sleep-onset trigger.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-so-light-timing",
      name: "Light & Timing",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-so-light-anchor",
          title: "Anchor light exposure at fixed times",
          instructions:
            "Morning light within 30 minutes of wake (outdoors preferred). Minimize bright artificial light after sunset.",
          category: "regulation",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-so-sleep-window",
          title: "Lock your sleep window",
          instructions:
            "Define a fixed 7.5-9 hour sleep window and defend both ends. Consistent in-bed and out-of-bed times are more powerful than total hours.",
          category: "planning",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-so-no-caffeine-pm",
          title: "No caffeine after 1pm",
          instructions:
            "Caffeine has a 5-7 hour half-life. Afternoon intake disrupts slow-wave sleep even when you feel it has no effect.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-so-deep-sleep",
      name: "Deep Sleep",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-so-quality-review",
          title: "Sleep quality review",
          instructions:
            "Review your 28-day sleep log. Identify nights with poor quality — what patterns appear? Adjust one variable based on evidence.",
          category: "planning",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-so-nsr-breathing",
          title: "Nightly nervous system reset",
          instructions:
            "4-7-8 breathing for 4 minutes as part of wind-down: inhale 4s, hold 7s, exhale 8s. Activates parasympathetic response.",
          category: "regulation",
          estimatedMinutes: 5,
          order: 2,
          required: true
        },
        {
          id: "task-so-next-day-prep",
          title: "Next-day intention before sleep",
          instructions:
            "Write your single most important task for tomorrow before bed. This closes the planning loop and reduces nighttime rumination.",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
