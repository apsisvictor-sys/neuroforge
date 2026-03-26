import { Resend } from "resend";
import { logger } from "@/infrastructure/logging/logger";

// TODO(FEAT-14-E): Replace inline HTML with proper React Email templates
// (GiftPurchaseEmail, GiftRecipientEmail, GiftRedemptionEmail)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FROM = "Neuroforge <hello@updates.neuroforge.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroforge.app";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.info(`[GIFT EMAIL STUB] To: ${to} | Subject: ${subject}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({ from: FROM, to: [to], subject, html });
    logger.info("Gift email sent", { to, subject, id: data.data?.id });
  } catch (error) {
    logger.error("Failed to send gift email", { to, subject, error });
  }
}

export async function sendGiftRedemptionEmail(params: {
  recipientEmail: string;
  durationMonths: number;
  premiumExpiresAt: Date;
}): Promise<void> {
  const { recipientEmail, durationMonths, premiumExpiresAt } = params;
  const expiryStr = escapeHtml(premiumExpiresAt.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }));
  await sendEmail(
    recipientEmail,
    "Your Neuroforge Premium gift has been activated",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Welcome to Neuroforge Premium</h2>
      <p>Your gift subscription has been activated. You now have <strong>${durationMonths} month${durationMonths !== 1 ? "s" : ""}</strong> of Premium access.</p>
      <p style="color: #64748b; font-size: 14px;">Access expires: ${expiryStr}</p>
      <a href="${APP_URL}/today"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        Start your protocol
      </a>
    </div>
    `
  );
}

export async function sendGiftPurchaseConfirmationEmail(params: {
  purchaserEmail: string;
  code: string;
  durationMonths: number;
  recipientEmail?: string;
}): Promise<void> {
  const { purchaserEmail, code, durationMonths, recipientEmail } = params;
  const safeCode = escapeHtml(code);
  const recipientNote = recipientEmail
    ? `<p>This gift is for <strong>${escapeHtml(recipientEmail)}</strong>.</p>`
    : "";
  await sendEmail(
    purchaserEmail,
    "Your Neuroforge gift code is ready",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #0f172a;">Your gift is confirmed</h2>
      <p>You've purchased ${durationMonths} month${durationMonths !== 1 ? "s" : ""} of Neuroforge Premium as a gift.</p>
      ${recipientNote}
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; font-family: monospace; font-size: 18px; letter-spacing: 2px; text-align: center;">
        ${safeCode}
      </div>
      <p style="color: #64748b; font-size: 14px;">Share this code with the recipient. They can redeem it at:</p>
      <a href="${APP_URL}/redeem"
         style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0;">
        ${APP_URL}/redeem
      </a>
    </div>
    `
  );
}
