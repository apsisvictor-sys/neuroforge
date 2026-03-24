import { createElement, type ReactNode } from "react";
import type { ProtocolCatalogItem } from "@/domain/entities/protocol";

type ProtocolCatalogContentProps = {
  items: ProtocolCatalogItem[];
  error: string | null;
  renderItem: (item: ProtocolCatalogItem) => ReactNode;
};

export function ProtocolCatalogContent({ items, error, renderItem }: ProtocolCatalogContentProps) {
  return createElement(
    "section",
    null,
    error ? createElement("section", { className: "protocol-catalog-error" }, createElement("p", null, error)) : null,
    !error && items.length === 0
      ? createElement("section", { className: "protocol-catalog-empty" }, "No protocols available")
      : null,
    !error && items.length > 0 ? createElement("ul", null, ...items.map((item) => renderItem(item))) : null
  );
}
