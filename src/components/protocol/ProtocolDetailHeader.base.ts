import { createElement } from "react";

type ProtocolDetailHeaderProps = {
  title: string;
  isEnrolled: boolean;
};

export function ProtocolDetailHeader({ title, isEnrolled }: ProtocolDetailHeaderProps) {
  return createElement(
    "h2",
    null,
    createElement(
      "span",
      { className: "protocol-detail-header-row" },
      title,
      " ",
      isEnrolled
        ? createElement("span", { className: "protocol-badge protocol-badge-enrolled" }, "Enrolled")
        : createElement("span", { className: "protocol-badge protocol-badge-not-enrolled" }, "Not enrolled")
    )
  );
}
