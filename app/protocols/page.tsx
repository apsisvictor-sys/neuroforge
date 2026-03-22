import { ProtocolCatalogClientView } from "@/components/protocol/ProtocolCatalogClientView";
import { loadProtocolCatalog } from "@/application/protocol/load-protocol-catalog";
import { repositories } from "@/infrastructure/db/repositories";
import { getSessionUserId } from "@/infrastructure/auth/session";
import { FREE_PROTOCOL_LIMIT } from "@/infrastructure/stripe/stripe-client";

export default async function ProtocolsPage() {
  const userId = await getSessionUserId();
  const { items, lockedCount, error } = await loadProtocolCatalog(repositories.protocol, {
    userId: userId ?? undefined,
    userRepository: repositories.user,
    freeProtocolLimit: FREE_PROTOCOL_LIMIT,
  });

  return (
    <main>
      <section className="protocol-catalog-header">
        <h2>Protocol Catalog</h2>
      </section>
      <section className="protocol-catalog-list-section">
        <ProtocolCatalogClientView items={items} lockedCount={lockedCount} error={error} />
      </section>
    </main>
  );
}
