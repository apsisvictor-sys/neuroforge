type EmptyStateProps = {
  message: string;
  description?: string;
};

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div style={{ padding: "24px 0", color: "#6b7280", textAlign: "center" }}>
      <p style={{ fontWeight: 500, margin: 0 }}>{message}</p>
      {description ? <p style={{ fontSize: 13, marginTop: 4 }}>{description}</p> : null}
    </div>
  );
}
