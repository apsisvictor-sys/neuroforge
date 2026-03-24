import { Resend } from "resend";
import { logger } from "@/infrastructure/logging/logger";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = "Neuroforge <hello@updates.neuroforge.app>";

export type OnboardingEmailPayload = {
  email: string;
  primaryType: string;
  recommendedProtocol: string;
};

async function sendOnboardingEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.info(`[ONBOARDING EMAIL DUMMY] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    const data = await resend.emails.send({ from: FROM, to: [to], subject, html });
    logger.info("Onboarding email sent", { to, subject, id: data.data?.id });
  } catch (error) {
    logger.error("Failed to send onboarding email", { to, subject, error });
  }
}

export async function sendOnboardingDay1(payload: OnboardingEmailPayload): Promise<void> {
  const { email, primaryType, recommendedProtocol } = payload;
  const safeType = escapeHtml(primaryType);
  const safeProtocol = escapeHtml(recommendedProtocol);
  await sendOnboardingEmail(
    email,
    "Your Neuroforge protocol starts today",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Your nervous system type: ${safeType}</h2>
      <p>You've taken the first step. Here's your starting protocol:</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; font-weight: 600;">${safeProtocol}</p>
      </div>
      <p>Your job today is simple: follow the protocol once. That's it. Don't optimise, don't rush — just do it.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/today"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Open today's plan
      </a>
      <p style="color:#64748b;font-size:13px;">You'll hear from us again in 2 days with a check-in.</p>
    </div>
    `
  );
}

export async function sendOnboardingDay2(payload: OnboardingEmailPayload): Promise<void> {
  const { email, primaryType } = payload;
  const safeType = escapeHtml(primaryType);
  await sendOnboardingEmail(
    email,
    "How did day 1 go?",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Check-in: 48 hours in</h2>
      <p>Two days ago you learned your pattern is <strong>${safeType}</strong>. The first session is always the hardest.</p>
      <p>If you missed yesterday — that's fine. That's expected. The protocol doesn't break if you skip one day. It breaks if you use a skip as a reason to quit.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/today"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Continue today
      </a>
      <p style="color:#64748b;font-size:13px;">Next check-in: day 4.</p>
    </div>
    `
  );
}

export async function sendOnboardingDay4(payload: OnboardingEmailPayload): Promise<void> {
  const { email } = payload;
  await sendOnboardingEmail(
    email,
    "Mid-week: what you might be noticing",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Day 4 — the resistance window</h2>
      <p>Days 3–5 are the most common dropout window. The novelty has worn off and results aren't visible yet.</p>
      <p>That discomfort you might feel? It's the signal that the protocol is working. Your nervous system is being asked to do something different from what it learned to do.</p>
      <p><strong>One small thing:</strong> notice how your attention feels today compared to day 1. Even 5% is progress.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/tracking"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Log today's check-in
      </a>
    </div>
    `
  );
}

export async function sendOnboardingDay6(payload: OnboardingEmailPayload): Promise<void> {
  const { email, primaryType } = payload;
  const safeType = escapeHtml(primaryType);
  await sendOnboardingEmail(
    email,
    "Your pattern is shifting",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Day 6 — pattern check</h2>
      <p>You've been working with your <strong>${safeType}</strong> pattern for almost a week.</p>
      <p>Research on nervous system regulation shows that the 7–10 day window is where the first measurable shift in baseline happens — not a cure, but a detectable change in the effort required to regulate.</p>
      <p>Tomorrow is day 7. Completing week 1 unlocks week 2's protocol adjustment.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/protocol"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        View your protocol
      </a>
    </div>
    `
  );
}

export async function sendOnboardingDay7(payload: OnboardingEmailPayload): Promise<void> {
  const { email, recommendedProtocol } = payload;
  const safeProtocol = escapeHtml(recommendedProtocol);
  await sendOnboardingEmail(
    email,
    "Week 1 complete — here's what's next",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Week 1 done.</h2>
      <p>You completed your first week of nervous system work. That puts you ahead of 80% of people who start.</p>
      <p>Your protocol for week 2 builds on what you established:</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0;">${safeProtocol}</p>
        <p style="margin: 8px 0 0; color: #64748b; font-size: 13px;">Week 2: increase consistency, add one recovery anchor.</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/protocol"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Start week 2
      </a>
      <p style="color:#64748b;font-size:13px;">You'll get a weekly summary every 7 days from here.</p>
    </div>
    `
  );
}

export async function sendOnboardingWeekly(payload: OnboardingEmailPayload & { weekNumber: number }): Promise<void> {
  const { email, primaryType, weekNumber } = payload;
  const safeType = escapeHtml(primaryType);
  const safeWeek = escapeHtml(String(weekNumber));
  await sendOnboardingEmail(
    email,
    `Week ${weekNumber} — nervous system update`,
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Week ${safeWeek} check-in</h2>
      <p>You've been managing your <strong>${safeType}</strong> pattern for ${safeWeek} weeks.</p>
      <p>Consistency compounds. Each week you stay with the protocol, the baseline cost of regulation drops.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app"}/tracking"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Review week ${safeWeek}
      </a>
    </div>
    `
  );
}
