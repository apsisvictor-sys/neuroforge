import { Resend } from "resend";
import { logger } from "@/infrastructure/logging/logger";

export async function sendMagicLinkEmail(email: string, magicLink: string) {
    if (!process.env.RESEND_API_KEY) {
        logger.warn("RESEND_API_KEY is not set. Falling back to console log for magic link.");
        logger.info(`[MAGIC LINK DUMMY EMAIL] To: ${email} | Link: ${magicLink}`);
        return;
    }

    // Lazy-init: only instantiate at request time so build succeeds without the key
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const fromAddress = process.env.RESEND_FROM_EMAIL ?? "noreply@astrologa.bg";
        const data = await resend.emails.send({
            from: `Neuroforge <${fromAddress}>`,
            to: [email],
            subject: "Sign in to Neuroforge",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to Neuroforge</h2>
          <p>Click the button below to sign in to your Neuroforge account. This link will expire in 15 minutes.</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 16px 0;">Sign In</a>
          <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
          <p style="color: #888; font-size: 12px;">Or copy and paste this link into your browser:<br />${magicLink}</p>
        </div>
      `,
        });

        logger.info("Magic link email sent via Resend", { email, id: data.data?.id });
        return data;
    } catch (error) {
        logger.error("Failed to send magic link email via Resend", { email, error });
        // Note: We don't throw here so we don't break the UI flow if email fails, 
        // but in a production app you might want to handle this differently.
    }
}
