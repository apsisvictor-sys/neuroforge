import type { ProtocolCatalogItem } from "@/domain/entities/protocol";

export async function loadProtocolCatalog(
  fetchImpl: typeof fetch = fetch
): Promise<{ items: ProtocolCatalogItem[]; error: string | null }> {
  try {
    const response = await fetchImpl("/api/protocol/catalog", { cache: "no-store" });
    if (!response.ok) {
      return { items: [], error: "Failed to load protocol catalog." };
    }

    const data = (await response.json()) as { items: ProtocolCatalogItem[] };
    return { items: data.items ?? [], error: null };
  } catch {
    return { items: [], error: "Failed to load protocol catalog." };
  }
}
