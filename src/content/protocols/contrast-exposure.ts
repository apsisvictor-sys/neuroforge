import type { ProtocolTemplate } from "@/domain/entities/protocol";

export const contrastExposureProtocol: ProtocolTemplate = {
  id: "protocol-contrast-exposure-v1",
  slug: "contrast-exposure",
  name: "Cold/Warm Contrast Exposure Protocol",
  description:
    "Nervous System Regulation — Use temperature contrast to train the autonomic nervous system, boost norepinephrine and dopamine, and build physiological resilience through progressive cold exposure.",
  version: 1,
  difficulty: "intermediate",
  pillar: "Nervous System Regulation",
  scientificRationale: "Cold water immersion triggers a sustained norepinephrine release of up to 300% above baseline and a prolonged dopamine elevation lasting 2–4 hours post-exposure, without the desensitization pattern of synthetic stimulants. The contrast protocol — alternating cold and warm — additionally trains autonomic flexibility, improving the nervous system's ability to shift between arousal and recovery states on demand.",
  scienceSummary: "Cold exposure triggers sustained norepinephrine and dopamine release, training autonomic flexibility without stimulant desensitization.",
  expectedOutcome: "Increased baseline energy and mood, improved cold stress tolerance, and enhanced autonomic flexibility for regulation on demand.",
  prerequisites: [],
  phases: [
    {
      id: "phase-ce-intro",
      name: "Cold Introduction",
      dayRange: { startDay: 1, endDay: 7 },
      tasks: [
        {
          id: "task-ce-30s-cold-end",
          title: "30-second cold finish",
          instructions:
            "End your regular shower with 30 seconds of cold water. Focus on controlled breathing — slow exhales reduce the shock response.",
          category: "regulation",
          estimatedMinutes: 3,
          order: 1,
          required: true
        },
        {
          id: "task-ce-breath-prep",
          title: "3 deep breaths before cold",
          instructions:
            "Before switching to cold, take 3 slow deep breaths. This primes the parasympathetic system and reduces the aversive spike.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-ce-note-state",
          title: "Note alertness after exposure",
          instructions:
            "Rate your alertness and mood 10 minutes after cold exposure (1-10). Norepinephrine spikes 2-3x — track whether you feel the effect.",
          category: "planning",
          estimatedMinutes: 3,
          order: 3,
          required: true
        }
      ]
    },
    {
      id: "phase-ce-contrast",
      name: "Contrast Building",
      dayRange: { startDay: 8, endDay: 14 },
      tasks: [
        {
          id: "task-ce-1m-contrast",
          title: "1 minute cold / 2 minutes warm contrast",
          instructions:
            "Alternate 1 minute cold, 2 minutes warm, repeat 2 cycles. End on cold. This trains vascular flexibility and nervous system recovery speed.",
          category: "regulation",
          estimatedMinutes: 10,
          order: 1,
          required: true
        },
        {
          id: "task-ce-controlled-exhale",
          title: "Extend exhale during cold",
          instructions:
            "During cold exposure, focus on exhales that are twice as long as inhales. This activates the vagal brake and reduces cortisol spike.",
          category: "regulation",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-ce-morning-time",
          title: "Complete exposure in the morning",
          instructions:
            "Time your contrast exposure within 2 hours of waking. Norepinephrine release pairs well with cortisol awakening response for maximum alertness benefit.",
          category: "focus",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-ce-extension",
      name: "Extension",
      dayRange: { startDay: 15, endDay: 21 },
      tasks: [
        {
          id: "task-ce-2m-contrast",
          title: "2 minutes cold / 2 minutes warm",
          instructions:
            "Extend to 2-minute cold / 2-minute warm, 2 cycles, ending cold. Sustained cold exposure deepens norepinephrine and dopamine adaptation.",
          category: "regulation",
          estimatedMinutes: 12,
          order: 1,
          required: true
        },
        {
          id: "task-ce-calm-assessment",
          title: "Post-exposure calm assessment",
          instructions:
            "After exposure, sit quietly for 2 minutes and observe your body state. This builds interoceptive awareness of your nervous system response.",
          category: "recovery",
          estimatedMinutes: 2,
          order: 2,
          required: true
        },
        {
          id: "task-ce-skip-check",
          title: "Consistency check",
          instructions:
            "Did you skip any exposure this week? If yes, identify the barrier (time, comfort, logistics) and adjust the protocol to remove it.",
          category: "planning",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    },
    {
      id: "phase-ce-anchoring",
      name: "Anchoring",
      dayRange: { startDay: 22, endDay: 28 },
      tasks: [
        {
          id: "task-ce-permanent-routine",
          title: "Lock in permanent contrast routine",
          instructions:
            "Define your non-negotiable minimum: at least 30 seconds cold end to every shower, daily. Write it as a behavioral default.",
          category: "planning",
          estimatedMinutes: 5,
          order: 1,
          required: true
        },
        {
          id: "task-ce-full-protocol",
          title: "Full contrast session",
          instructions: "Complete the full 2m cold / 2m warm / 2m cold protocol. End on cold. Note how you feel vs. day 1.",
          category: "regulation",
          estimatedMinutes: 12,
          order: 2,
          required: true
        },
        {
          id: "task-ce-resilience-note",
          title: "Resilience reflection",
          instructions:
            "Compare how you respond to discomfort now vs. day 1. Write one observation about changed stress tolerance.",
          category: "recovery",
          estimatedMinutes: 5,
          order: 3,
          required: false
        }
      ]
    }
  ]
};
