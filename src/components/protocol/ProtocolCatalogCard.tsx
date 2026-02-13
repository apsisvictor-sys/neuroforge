import Link from "next/link";
import type { ProtocolCatalogItem } from "@/domain/entities/protocol";

export function ProtocolCatalogCard({ item }: { item: ProtocolCatalogItem }) {
  const firstPhaseName = (item as ProtocolCatalogItem & { firstPhaseName?: string }).firstPhaseName ?? "—";

  return (
    <li>
      <h3>{item.title}</h3>
      <p>{item.shortDescription}</p>
      <p>
        Total days: {item.totalDays} | Phases: {item.phaseCount}
      </p>
      <p>First phase: {firstPhaseName}</p>
      <Link href={`/protocol?slug=${item.slug}`}>View protocol</Link>
    </li>
  );
}
