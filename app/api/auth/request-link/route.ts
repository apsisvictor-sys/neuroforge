import { NextRequest } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { getEnv } from "@/infrastructure/config/env";
import { logger } from "@/infrastructure/logging/logger";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";

export const POST = withApiLogging("/api/auth/request-link", "POST", async (request: NextRequest) => {
  try {
    getEnv();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
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

    logger.info("Magic link generated", { email, magicLink });

    return ok({ success: true, message: "Magic link created", debugMagicLink: magicLink });
  } catch (error) {
    return serverError(error);
  }
});
