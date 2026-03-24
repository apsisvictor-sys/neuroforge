import { createElement } from "react";

type ProtocolCatalogCardBadgesProps = {
  phaseCount: number;
  totalDays: number;
};

export function ProtocolCatalogCardBadges({ phaseCount, totalDays }: ProtocolCatalogCardBadgesProps) {
  return createElement(
    "p",
    null,
    createElement(
      "span",
      { className: "protocol-badge-row" },
      createElement(
        "span",
        { className: "protocol-card-badge protocol-card-badge-phases" },
        `${phaseCount} phases`
      ),
      " ",
      createElement("span", { className: "protocol-card-badge protocol-card-badge-days" }, `${totalDays} days`)
    ),
  );
}
