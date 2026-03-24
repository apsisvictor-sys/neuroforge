import { createElement } from "react";

export type ProtocolSummaryBlockProps = {
  totalDays: number;
  phaseCount: number;
  taskDefinitionCount: number;
};

export function ProtocolSummaryBlock({ totalDays, phaseCount, taskDefinitionCount }: ProtocolSummaryBlockProps) {
  return createElement(
    "section",
    { className: "protocol-summary-block" },
    createElement("h3", null, "Protocol summary"),
    createElement("p", null, `Total days: ${totalDays}`),
    createElement("p", null, `Phase count: ${phaseCount}`),
    createElement("p", null, `Task definitions: ${taskDefinitionCount}`)
  );
}
