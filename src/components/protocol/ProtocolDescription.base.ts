import { createElement } from "react";

type ProtocolDescriptionProps = {
  description: string | null | undefined;
};

export function ProtocolDescription({ description }: ProtocolDescriptionProps) {
  if (typeof description === "string" && description.trim().length > 0) {
    return createElement("p", { className: "protocol-description" }, description);
  }

  return createElement(
    "p",
    { className: "protocol-description-empty protocol-empty-block" },
    "No description available for this protocol."
  );
}
