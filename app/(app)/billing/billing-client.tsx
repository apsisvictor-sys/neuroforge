"use client";

import { useState } from "react";
import Link from "next/link";

const T = {
  bg: "#050d1a",
  bgCard: "#0d1a2e",
  border: "#1e3a5f",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentBlue: "#3b82f6",
  accentGreen: "#10b981",
};

interface BillingClientProps {
  tier: "free" | "premium" | "professional";
  daysRemaining: number | null;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  professional: "Professional",
};

export function BillingClient({ tier, daysRemaining }: BillingClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError("Could not open billing portal. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isPaid = tier !== "free";

  return (
    <main style={{ background: T.bg, minHeight: "100vh", padding: "60px 24px", color: T.textPrimary, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: T.textPrimary }}>
          Billing
        </h1>
        <p style={{ color: T.textSecondary, marginBottom: 40 }}>
          Manage your subscription and payment details.
        </p>

        {/* Current plan card */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px 20px", marginBottom: 24 }}>
          <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Current plan
          </p>
          <p style={{ color: T.textPrimary, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>
            {TIER_LABELS[tier]}
          </p>
          {daysRemaining !== null && daysRemaining > 0 && (
            <p style={{ color: T.accentGreen, fontSize: 14, margin: "4px 0 0" }}>
              Free trial — {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>

        {/* Actions */}
        {isPaid ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={openPortal}
              disabled={loading}
              aria-label="Open Stripe billing portal"
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: T.accentBlue,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Opening portal…" : "Manage subscription"}
            </button>
            {error && <p style={{ color: "#ef4444", fontSize: 14 }}>{error}</p>}
            <p style={{ color: T.textMuted, fontSize: 13 }}>
              Change plan, update payment method, or cancel — all in the Stripe portal.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/pricing"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: 12,
                background: T.accentBlue,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Upgrade to Premium
            </Link>
            <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center" }}>
              Less than one coffee per week. 14-day free trial included.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
