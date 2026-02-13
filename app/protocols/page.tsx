import { ProtocolCatalogCard } from "@/components/protocol/ProtocolCatalogCard";
import { loadProtocolCatalog } from "./catalog-loader";

export default async function ProtocolsPage() {
  const { items, error } = await loadProtocolCatalog();

  return (
    <main>
      <h2>Protocol Catalog</h2>
      {error ? <p>{error}</p> : null}
      {!error && items.length === 0 ? <p>No protocols available.</p> : null}
      {!error && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <ProtocolCatalogCard key={item.id} item={item} />
          ))}
        </ul>
      ) : null}
    </main>
  );
}
