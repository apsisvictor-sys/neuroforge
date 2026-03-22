import { TS, CATEGORY_CONFIG } from "./tokens";
import type { SupplementCategory } from "@/domain/entities/supplement";

export type { SupplementCategory };

interface Props {
  category: SupplementCategory | "all";
  active: boolean;
  onClick: () => void;
}

export function SupplementCategoryChip({ category, active, onClick }: Props) {
  if (category === "all") {
    return (
      <button
        onClick={onClick}
        aria-pressed={active}
        style={{
          padding: "6px 16px",
          borderRadius: 20,
          border: `1px solid ${active ? TS.accentBlue : TS.border}`,
          background: active ? "rgba(59,130,246,0.15)" : "transparent",
          color: active ? "#60a5fa" : TS.textSecondary,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        All
      </button>
    );
  }
  const cfg = CATEGORY_CONFIG[category];
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Filter by ${cfg.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 14px",
        borderRadius: 20,
        border: `1px solid ${active ? cfg.border : TS.border}`,
        background: active ? cfg.bg : "transparent",
        color: active ? cfg.color : TS.textSecondary,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </button>
  );
}
