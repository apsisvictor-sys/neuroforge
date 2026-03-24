"use client";

import { useState, useRef } from "react";

// ─────────────────────────────────────────────
// Design tokens (inline — no Tailwind required)
// ─────────────────────────────────────────────
const T = {
  bgDeep: "#050d1a",
  bgSection: "#07111f",
  bgCard: "#0d1a2e",
  bgCardHover: "#102240",
  accentBlue: "#3b82f6",
  accentBlueBright: "#60a5fa",
  accentNeural: "#00d4ff",
  accentGreen: "#10b981",
  textPrimary: "#f0f4ff",
  textSecondary: "#94a3b8",
  textMuted: "#4a5568",
  border: "#1e3a5f",
  borderHover: "#2e5c8e",
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        color: T.accentNeural,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function EmailCapture({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    // Placeholder — wire to /api/waitlist endpoint
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: "rgba(16,185,129,0.1)",
          border: `1px solid ${T.accentGreen}`,
          borderRadius: 12,
          padding: "20px 28px",
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <p style={{ color: T.accentGreen, fontWeight: 700, fontSize: 18, margin: 0 }}>
          You&apos;re on the list.
        </p>
        <p style={{ color: T.textSecondary, fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          We&apos;ll email you when early access opens. No spam — ever.
        </p>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          style={{
            flex: 1,
            minWidth: 200,
            padding: "14px 18px",
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.05)",
            color: T.textPrimary,
            fontSize: 16,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Join Early Access waitlist"
          style={{
            padding: "14px 28px",
            borderRadius: 10,
            border: "none",
            background: loading ? "#2563eb" : T.accentBlue,
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Joining…" : "Join Early Access"}
        </button>
      </div>
      <p style={{ color: T.textMuted, fontSize: 12, textAlign: "center", margin: 0 }}>
        Free to join. No credit card. Unsubscribe anytime.
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// Section: Hero
// ─────────────────────────────────────────────
function HeroSection({ howItWorksRef }: { howItWorksRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section
      aria-label="Hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 720, width: "100%" }}>
        <SectionLabel>Nervous System Regulation OS</SectionLabel>

        {/* Core message — never change this copy */}
        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: T.textPrimary,
            margin: "0 0 24px",
            letterSpacing: "-0.02em",
          }}
        >
          You are not lazy.
          <br />
          <span style={{ color: T.accentBlueBright }}>Your nervous system</span>
          <br />
          is dysregulated.
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2.5vw, 22px)",
            color: T.textSecondary,
            lineHeight: 1.6,
            maxWidth: 580,
            margin: "0 auto 40px",
          }}
        >
          Neuroforge is the protocol-based operating system for dopamine restoration and nervous system
          regulation — built on neuroscience, not willpower.
        </p>

        <EmailCapture id="hero-email-capture" />

        <div style={{ marginTop: 24 }}>
          <button
            onClick={() =>
              howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "none",
              border: "none",
              color: T.textSecondary,
              fontSize: 15,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
            aria-label="Scroll to See How It Works section"
          >
            See how it works ↓
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Mechanism Framing
// ─────────────────────────────────────────────
const MECHANISM_CARDS = [
  {
    emoji: "⚡",
    title: "Dopamine loop hijacking",
    body: "Scrolling, notifications, and algorithmic feeds fire your dopamine system 200× more intensely than real-life rewards — leaving natural motivation completely drained.",
  },
  {
    emoji: "🧠",
    title: "Nervous system dysregulation",
    body: "Chronic overstimulation locks your nervous system into a threat response. Your brain cannot focus, rest, or feel motivated — not because of character, but neurobiology.",
  },
  {
    emoji: "🔄",
    title: "The protocol path out",
    body: "Systematic, day-by-day protocols recalibrate your reward system. Motivation returns — not from willpower, but from restoration of your neurological baseline.",
  },
];

function MechanismSection() {
  return (
    <section
      aria-label="The Problem and Mechanism"
      style={{
        background: T.bgSection,
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>The Real Problem</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Your brain is not broken.
            <br />
            It&apos;s responding perfectly to a broken environment.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
          role="list"
        >
          {MECHANISM_CARDS.map((card) => (
            <article
              key={card.title}
              role="listitem"
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "28px 24px",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }} aria-hidden="true">
                {card.emoji}
              </div>
              <h3
                style={{
                  color: T.textPrimary,
                  fontSize: 18,
                  fontWeight: 700,
                  margin: "0 0 10px",
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: How It Works (3 steps)
// ─────────────────────────────────────────────
const HOW_STEPS = [
  {
    step: "01",
    title: "Assess your baseline",
    body: "Answer a 5-minute nervous system assessment. We identify your regulation profile, dopamine depletion severity, and the right starting protocol.",
  },
  {
    step: "02",
    title: "Follow the protocol",
    body: "Daily micro-tasks calibrated to your type. No willpower required — just follow the sequence. Each day builds the neurological foundation for the next.",
  },
  {
    step: "03",
    title: "Track and adapt",
    body: "Log focus, calm, and energy each day. Your AI coach monitors patterns, flags regressions, and adjusts recommendations — not your effort, your system.",
  },
];

function HowItWorksSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section
      ref={sectionRef}
      aria-label="How Neuroforge works"
      style={{ padding: "80px 24px" }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>How It Works</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Three steps. Zero willpower required.
          </h2>
        </div>

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {HOW_STEPS.map((s, i) => (
            <li
              key={s.step}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              {/* Step number */}
              <div
                aria-hidden="true"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `rgba(59,130,246,${0.12 + i * 0.04})`,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.accentBlueBright,
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div>
                <h3
                  style={{
                    color: T.textPrimary,
                    fontSize: 20,
                    fontWeight: 700,
                    margin: "10px 0 8px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Trust / Proof
// ─────────────────────────────────────────────
const PROOF_POINTS = [
  { stat: "Science-backed", desc: "Protocols grounded in dopamine, vagal nerve, and neuroplasticity research" },
  { stat: "Not therapy", desc: "A precision system, not a substitute for clinical care — complementary and self-led" },
  { stat: "Protocol-based", desc: "Same method elite athletes use — systematic, measurable, repeatable outcomes" },
];

function TrustSection() {
  return (
    <section
      aria-label="Trust and credibility"
      style={{
        background: T.bgSection,
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>Why It Works</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 36px)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Built on neuroscience. Not vibes.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {PROOF_POINTS.map((p) => (
            <div
              key={p.stat}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ color: T.accentBlueBright, fontWeight: 800, fontSize: 16, margin: "0 0 8px" }}>
                {p.stat}
              </p>
              <p style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tone signal */}
        <blockquote
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
            borderLeft: "none",
            padding: 0,
          }}
        >
          <p
            style={{
              color: T.textPrimary,
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 600,
              lineHeight: 1.4,
              fontStyle: "italic",
              margin: "0 0 12px",
            }}
          >
            &ldquo;Motivation is not created — it is restored. Calm is not learned — it is rebuilt.
            Focus is not forced — it emerges from regulation.&rdquo;
          </p>
          <cite style={{ color: T.textMuted, fontSize: 13 }}>Neuroforge Core Thesis</cite>
        </blockquote>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: FAQ
// ─────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Is this a meditation app?",
    a: "No. Neuroforge is a protocol OS — it includes breathing and grounding exercises as one tool among many, but the system is comprehensive: stimulus reduction, sleep, nutrition, behavioral rewiring, and AI coaching combined.",
  },
  {
    q: "Do I need willpower to stick to this?",
    a: "No. The system is designed specifically for people whose willpower is depleted. Protocols are structured, small, and sequenced so each day prepares your nervous system for the next one.",
  },
  {
    q: "Is this therapy or medical advice?",
    a: "No. Neuroforge is a self-directed educational and behavioral system. It is not a substitute for clinical care. If you are in crisis or dealing with a medical condition, please see a qualified professional.",
  },
  {
    q: "How long until I notice a difference?",
    a: "Most users report improved sleep and reduced phone cravings within 7–10 days of the Core Reset protocol. Sustained focus restoration typically takes 21–30 days of consistent protocol adherence.",
  },
  {
    q: "What does 'early access' mean?",
    a: "We're in pre-launch. Early access members get the first wave of invitations, a discounted founding member price, and direct input into the protocols library.",
  },
  {
    q: "Is it free?",
    a: "There will be a free tier with 5 core protocols and basic tracking. Premium unlocks the full protocol library (50+), unlimited AI coaching, and advanced pattern insights.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-label="Frequently asked questions" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 36px)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Common questions
          </h2>
        </div>

        <dl style={{ margin: 0, padding: 0 }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <dt>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      padding: "20px 0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      color: T.textPrimary,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        color: T.textMuted,
                        fontSize: 20,
                        transform: isOpen ? "rotate(45deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    >
                      +
                    </span>
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${idx}`}
                  style={{
                    margin: 0,
                    overflow: "hidden",
                    maxHeight: isOpen ? 300 : 0,
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      color: T.textSecondary,
                      fontSize: 15,
                      lineHeight: 1.65,
                      margin: "0 0 20px",
                    }}
                  >
                    {item.a}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section: Final CTA
// ─────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section
      aria-label="Final call to action"
      style={{
        background: "linear-gradient(135deg, #07111f 0%, #0a1628 60%, #060d1a 100%)",
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
        <SectionLabel>Early Access</SectionLabel>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "0 0 20px",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Start restoring your baseline.
        </h2>
        <p
          style={{
            color: T.textSecondary,
            fontSize: 18,
            lineHeight: 1.55,
            margin: "0 0 40px",
          }}
        >
          Join the waitlist. We&apos;ll send your invite when early access opens — no spam, no pressure.
        </p>

        <EmailCapture id="final-email-capture" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: T.bgDeep,
        borderTop: `1px solid ${T.border}`,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0 }}>
        © {new Date().getFullYear()} Neuroforge. Not medical advice. Educational system only.
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Page root
// ─────────────────────────────────────────────
export default function WaitlistPage() {
  const howItWorksRef = useRef<HTMLElement | null>(null);

  return (
    <div
      style={{
        background: T.bgDeep,
        color: T.textPrimary,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: -9999,
          top: 8,
          zIndex: 999,
          background: T.accentBlue,
          color: "#fff",
          padding: "8px 16px",
          borderRadius: 6,
          fontSize: 14,
        }}
        onFocus={(e) => (e.currentTarget.style.left = "8px")}
        onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
      >
        Skip to main content
      </a>

      {/* Minimal header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(5,13,26,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${T.border}`,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "none",
        }}
        role="banner"
      >
        <span style={{ fontWeight: 800, fontSize: 20, color: T.textPrimary, letterSpacing: "-0.03em" }}>
          Neuroforge
        </span>
        <a
          href="#hero-email-capture"
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            background: T.accentBlue,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
          aria-label="Join the Neuroforge Early Access waitlist"
        >
          Join Waitlist
        </a>
      </header>

      <main id="main-content">
        <HeroSection howItWorksRef={howItWorksRef} />
        <MechanismSection />
        <HowItWorksSection sectionRef={howItWorksRef} />
        <TrustSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
