/**
 * PricingPage — Phase 4.3 Monetization UI
 *
 * 3-tier layout: Free / Premium / Professional
 * Monthly + annual toggle (annual saves 25%)
 *
 * Accessibility: toggle via role=switch, feature lists with aria-labels
 */

"use client";

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bgPage: "#050d1a",
  bgCard: "#0d1a2e",
  bgCardHighlight: "#102240",
  bgCardFree: "#070e1c",
  border: "#1e3a5f",
  borderHighlight: "#3b82f6",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  accentBlue: "#3b82f6",
  accentGreen: "#10b981",
  accentPurple: "#a78bfa",
};

// ─── Tier data ─────────────────────────────────────────────────────────────────

interface PricingTier {
  id: "free" | "premium" | "professional";
  name: string;
  price: { monthly: string; annual: string };
  annualNote?: string;
  highlight?: boolean;
  badge?: string;
  color: string;
  features: string[];
  cta: string;
  ctaNote?: string;
}

const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "€0", annual: "€0" },
    color: T.textSecondary,
    features: [
      "Nervous system assessment",
      "5 core protocols",
      "Basic daily tracking (focus / calm / energy)",
      "Weekly email reminders",
      "AI Coach — 5 messages/month",
    ],
    cta: "Get started — free",
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: "€9.99/mo", annual: "€7.49/mo" },
    annualNote: "Billed €89.99/yr — save 25%",
    highlight: true,
    badge: "Most popular",
    color: "#60a5fa",
    features: [
      "Full protocol library — 50+ protocols",
      "All pillars and difficulty levels",
      "Unlimited AI Coach conversations",
      "Advanced tracking & pattern insights",
      "Streak analytics & regression alerts",
      "Priority community access",
      "New protocols added monthly",
    ],
    cta: "Start 14-day free trial",
    ctaNote: "No credit card required for first 7 days",
  },
  {
    id: "professional",
    name: "Professional",
    price: { monthly: "€29.99/mo", annual: "€24.99/mo" },
    annualNote: "Billed €299.99/yr",
    color: "#a78bfa",
    features: [
      "Everything in Premium",
      "Monthly 1:1 human coaching session",
      "Custom protocol creation",
      "Priority AI response time",
      "Early access to new features",
      "Personalized protocol recommendations",
    ],
    cta: "Choose Professional",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function BillingToggle({
  annual,
  onChange,
}: {
  annual: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
        marginBottom: 48,
      }}
    >
      <span style={{ color: annual ? T.textMuted : T.textPrimary, fontSize: 15, fontWeight: 500 }}>
        Monthly
      </span>

      <button
        role="switch"
        aria-checked={annual}
        aria-label={annual ? "Switch to monthly billing" : "Switch to annual billing"}
        onClick={() => onChange(!annual)}
        style={{
          width: 48,
          height: 26,
          borderRadius: 13,
          background: annual ? T.accentBlue : "#1e3a5f",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          padding: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: annual ? 25 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
          aria-hidden="true"
        />
      </button>

      <span style={{ color: annual ? T.textPrimary : T.textMuted, fontSize: 15, fontWeight: 500 }}>
        Annual{" "}
        <span
          style={{
            background: "rgba(16,185,129,0.15)",
            color: T.accentGreen,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 10,
            marginLeft: 4,
          }}
        >
          Save 25%
        </span>
      </span>
    </div>
  );
}

function TierCard({ tier, annual }: { tier: PricingTier; annual: boolean }) {
  return (
    <div
      style={{
        background: tier.highlight ? T.bgCardHighlight : tier.id === "free" ? T.bgCardFree : T.bgCard,
        border: `${tier.highlight ? 2 : 1}px solid ${tier.highlight ? T.borderHighlight : T.border}`,
        borderRadius: 20,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
      }}
      aria-label={`${tier.name} plan`}
    >
      {/* Badge */}
      {tier.badge && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.accentBlue,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: 20,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
          aria-label="Most popular plan"
        >
          {tier.badge}
        </div>
      )}

      {/* Name */}
      <div>
        <p style={{ color: tier.color, fontWeight: 800, fontSize: 14, margin: "0 0 4px", letterSpacing: "0.03em" }}>
          {tier.name.toUpperCase()}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ color: T.textPrimary, fontWeight: 800, fontSize: 32, lineHeight: 1 }}>
            {annual ? tier.price.annual : tier.price.monthly}
          </span>
        </div>
        {annual && tier.annualNote && (
          <p style={{ color: T.accentGreen, fontSize: 12, margin: "4px 0 0", fontWeight: 500 }}>
            {tier.annualNote}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, margin: 0 }} />

      {/* Features */}
      <ul
        style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}
        aria-label={`${tier.name} plan features`}
      >
        {tier.features.map((f) => (
          <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ color: tier.id === "professional" ? T.accentPurple : T.accentGreen, flexShrink: 0, marginTop: 1, fontSize: 14 }}>
              ✓
            </span>
            <span style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.45 }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{ marginTop: "auto", paddingTop: 8 }}>
        <a
          href={tier.id === "free" ? "/auth/sign-in" : `/upgrade?plan=${tier.id}&billing=${annual ? "annual" : "monthly"}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "13px 20px",
            borderRadius: 12,
            background: tier.highlight ? T.accentBlue : tier.id === "free" ? "transparent" : "transparent",
            border: tier.highlight ? "none" : `1px solid ${T.border}`,
            color: tier.highlight ? "#fff" : T.textSecondary,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          aria-label={`${tier.cta} — ${tier.name} plan`}
        >
          {tier.cta}
        </a>
        {tier.ctaNote && (
          <p style={{ color: T.textMuted, fontSize: 12, textAlign: "center", margin: "8px 0 0" }}>
            {tier.ctaNote}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── PricingPage ──────────────────────────────────────────────────────────────

export function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div
      style={{
        background: T.bgPage,
        color: T.textPrimary,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: "80px 24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              color: "#60a5fa",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Pricing
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Restore your baseline.
            <br />
            Start free.
          </h1>
          <p style={{ color: T.textSecondary, fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
            Less than one coffee per week for full access to every protocol and unlimited AI coaching.
          </p>
        </div>

        {/* Billing toggle */}
        <BillingToggle annual={annual} onChange={setAnnual} />

        {/* Tier cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
          role="list"
          aria-label="Pricing plans"
        >
          {TIERS.map((tier) => (
            <div key={tier.id} role="listitem">
              <TierCard tier={tier} annual={annual} />
            </div>
          ))}
        </div>

        {/* Footer trust */}
        <p style={{ textAlign: "center", color: T.textMuted, fontSize: 13, marginTop: 40 }}>
          30-day money-back guarantee · Cancel anytime · Secure payments · Not medical advice
        </p>
      </div>
    </div>
  );
}
