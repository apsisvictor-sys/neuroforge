import type { ProtocolCatalogItem, ProtocolTemplate } from "../../../domain/entities/protocol.ts";
import { toProtocolCatalogItem } from "../../../protocol-engine/definitions/map-catalog-item.ts";
import { protocolTemplates } from "../../../protocol-engine/definitions/templates.ts";

// Static protocol definitions are memoized for read-path performance.
// Safe because templates are immutable at runtime.
export const memoizedProtocolTemplateDefinitions: Readonly<{
  templates: readonly ProtocolTemplate[];
  catalogItems: readonly ProtocolCatalogItem[];
}> = {
  templates: protocolTemplates,
  catalogItems: protocolTemplates.map(toProtocolCatalogItem)
};
