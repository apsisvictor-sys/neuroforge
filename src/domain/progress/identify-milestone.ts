const MILESTONES = [
  { day: 7,  message: "Your prefrontal cortex is building new pathways right now." },
  { day: 14, message: "Two weeks. Neuroplasticity is underway." },
  { day: 30, message: "One month. Most people quit here. You didn't." },
  { day: 56, message: "8 weeks complete. Transformation achieved." },
] as const;

export type Milestone = { day: number; message: string };

/**
 * Returns the milestone for the given number of completed days, or null if none.
 */
export function identifyMilestone(daysCompleted: number): Milestone | null {
  const match = MILESTONES.find((m) => m.day === daysCompleted);
  return match ?? null;
}
