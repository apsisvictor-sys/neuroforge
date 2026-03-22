import { ProtocolCatalogClientView } from "@/components/protocol/ProtocolCatalogClientView";
import { loadProtocolCatalog } from "@/application/protocol/load-protocol-catalog";
import { repositories } from "@/infrastructure/db/repositories";

export default async function ProtocolsPage() {
  const { items, error } = await loadProtocolCatalog(repositories.protocol);

  return (
    <main>
      <section className="protocol-catalog-header">
        <h2>Protocol Catalog</h2>
      </section>
      <section className="protocol-catalog-list-section">
        <ProtocolCatalogClientView items={items} error={error} />
      </section>
    </main>
  );
}
