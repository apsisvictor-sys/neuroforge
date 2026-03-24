import Link from "next/link";
import type { ProtocolCatalogItem } from "@/domain/entities/protocol";
import { ProtocolCatalogCardBadges } from "@/components/protocol/ProtocolCatalogCardBadges";

export function ProtocolCatalogCard({ item }: { item: ProtocolCatalogItem }) {
  const firstPhaseName = (item as ProtocolCatalogItem & { firstPhaseName?: string }).firstPhaseName ?? "—";

  return (
    <li>
      <section className="protocol-catalog-card-body">
        <h3>{item.title}</h3>
        <p>{item.shortDescription}</p>
        <ProtocolCatalogCardBadges phaseCount={item.phaseCount} totalDays={item.totalDays} />
        <p>First phase: {firstPhaseName}</p>
        <div className="protocol-card-cta-row">
          <Link href={`/protocol?slug=${item.slug}`}>View protocol</Link>
        </div>
      </section>
    </li>
  );
}
