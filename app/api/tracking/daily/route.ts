import { NextRequest } from "next/server";
import { submitDailyCheckin } from "@/application/use-cases/submit-daily-checkin";
import { consumeNonce } from "@/infrastructure/auth/nonce";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { requireNumberInRange, requireString } from "@/lib/validate";

export const POST = withApiLogging("/api/tracking/daily", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const nonce = request.headers.get("x-nonce");
    if (!nonce || !consumeNonce(auth.userId, nonce)) {
      return badRequest("Invalid nonce");
    }

    const body = await request.json();
    let dayKey: string;
    try {
      dayKey = requireString(String(body.dayKey || ""), "dayKey");
    } catch {
      return badRequest("dayKey is required");
    }

    const saved = await submitDailyCheckin({
      userId: auth.userId,
      payload: {
        dayKey,
        focus: requireNumberInRange(body.focus, "Focus", 0, 10),
        calm: requireNumberInRange(body.calm, "Calm", 0, 10),
        energy: requireNumberInRange(body.energy, "Energy", 0, 10),
        note: body.note ? String(body.note) : undefined
      },
      trackingRepository: repositories.tracking
    });

    return ok(saved);
  } catch (error) {
    return serverError(error);
  }
});
