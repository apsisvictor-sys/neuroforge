import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { logger } from "@/infrastructure/logging/logger";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";
import { sendMagicLinkEmail } from "@/infrastructure/email/resend";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";

export const POST = withApiLogging("/api/auth/request-link", "POST", async (request: NextRequest) => {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    noopMetricsRecorder.increment("auth.magic_link.request");
    if (!email || !email.includes("@")) {
      return badRequest("Valid email is required");
    }

    const existing = await repositories.user.getByEmail(email);
    const user = existing ?? (await repositories.user.create(email));
    const token = await repositories.auth.createMagicLinkToken(
      user.id,
      email,
      new Date(Date.now() + 15 * 60 * 1000).toISOString()
    );

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const magicLink = `${appUrl}/auth/verify?token=${token}`;

    // Send email synchronously instead of using the background worker queue
    await sendMagicLinkEmail(email, magicLink);

    logger.info("Magic link generated and sent", { email, magicLink });

    const isDev = process.env.NODE_ENV !== "production";
    return ok({
      success: true,
      message: "Magic link created",
      ...(isDev && { debugMagicLink: magicLink })
    });
  } catch (error) {
    return serverError(error);
  }
});
