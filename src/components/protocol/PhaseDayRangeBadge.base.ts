import { createElement } from "react";

type PhaseDayRangeBadgeProps = {
  startDay: number;
  endDay: number;
};

export function PhaseDayRangeBadge({ startDay, endDay }: PhaseDayRangeBadgeProps) {
  return createElement("span", { className: "phase-badge phase-badge-range" }, `Days ${startDay}-${endDay}`);
}
