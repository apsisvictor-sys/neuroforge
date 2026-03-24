import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import Link from "next/link";

const T = {
  bg: "#050d1a",
  bgCard: "#0d1a2e",
  border: "#1e3a5f",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentGreen: "#10b981",
  accentBlue: "#3b82f6",
};

export default async function BillingSuccessPage() {
  await requireUserPage();

  return (
    <main
      style={{
        background: T.bg,
        minHeight: "100vh",
        padding: "60px 24px",
        color: T.textPrimary,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: T.accentGreen,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 28,
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 12,
            color: T.textPrimary,
          }}
        >
          You&apos;re all set!
        </h1>

        <p style={{ color: T.textSecondary, marginBottom: 40, fontSize: 16 }}>
          Your subscription is now active. Welcome to the full Neuroforge
          experience.
        </p>

        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 32,
          }}
        >
          <p style={{ color: T.textMuted, fontSize: 13, margin: 0 }}>
            A confirmation email is on its way. You can manage your subscription
            at any time from the{" "}
            <Link
              href="/billing"
              style={{ color: T.accentBlue, textDecoration: "none" }}
            >
              billing page
            </Link>
            .
          </p>
        </div>

        <Link
          href="/today"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            borderRadius: 12,
            background: T.accentBlue,
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
