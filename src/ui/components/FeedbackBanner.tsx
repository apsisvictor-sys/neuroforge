"use client";

type FeedbackType = "success" | "error" | "info";

export function FeedbackBanner({ type, message }: { type: FeedbackType; message: string | null }) {
  if (!message) {
    return null;
  }

  const palette: Record<FeedbackType, { bg: string; border: string; color: string }> = {
    success: { bg: "#ecfdf3", border: "#86efac", color: "#166534" },
    error: { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
    info: { bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" }
  };

  const style = palette[type];

  return (
    <div
      role="status"
      style={{
        marginTop: 12,
        marginBottom: 12,
        padding: "8px 10px",
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
        borderRadius: 6
      }}
    >
      {message}
    </div>
  );
}
