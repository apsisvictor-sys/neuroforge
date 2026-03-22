import { TS } from "./tokens";

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
  variant?: "default" | "warning" | "danger";
}

export function SupplementSection({ title, icon, children, variant = "default" }: Props) {
  const borderColor =
    variant === "danger" ? TS.warningBorder
    : variant === "warning" ? "rgba(245,158,11,0.2)"
    : TS.border;
  const bgColor =
    variant === "danger" ? TS.warningBg
    : variant === "warning" ? "rgba(245,158,11,0.05)"
    : "transparent";
  const titleColor =
    variant === "danger" ? TS.warningText
    : variant === "warning" ? "#fcd34d"
    : TS.textPrimary;

  return (
    <section
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: "20px",
        background: bgColor,
        marginBottom: 16,
      }}
    >
      <h2 style={{
        color: titleColor, fontSize: 15, fontWeight: 700,
        margin: "0 0 12px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span aria-hidden="true">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
