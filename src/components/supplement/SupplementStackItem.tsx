import Link from "next/link";
import { TS, CATEGORY_CONFIG } from "./tokens";
import type { SupplementCategory } from "@/domain/entities/supplement";

interface Props {
  supplement: {
    slug: string;
    name: string;
    category: SupplementCategory;
  };
  rationale: string;
}

export function SupplementStackItem({ supplement, rationale }: Props) {
  const cfg = CATEGORY_CONFIG[supplement.category];
  return (
    <div style={{
      background: TS.bgCard,
      border: `1px solid ${TS.border}`,
      borderRadius: 12, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 8,
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <Link href={`/supplements/${supplement.slug}`} style={{ color: TS.textPrimary, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
          {supplement.name}
        </Link>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            padding: "3px 9px", borderRadius: 20,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            color: cfg.color, fontSize: 11, fontWeight: 700,
          }}>
            {cfg.icon} {cfg.label}
          </span>
          <span style={{
            padding: "2px 8px", borderRadius: 20,
            background: "rgba(148,163,184,0.1)",
            color: TS.textMuted, fontSize: 10, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            Supportive, not primary
          </span>
        </div>
      </div>
      <p style={{ color: TS.textSecondary, fontSize: 13, lineHeight: 1.5, margin: 0 }}>
        {rationale}
      </p>
    </div>
  );
}
