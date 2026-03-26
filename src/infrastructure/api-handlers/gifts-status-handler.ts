import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";
import { logger } from "@/infrastructure/logging/logger";

// Simple in-process rate limiter for the public status endpoint
// Keyed by IP, max 20 requests per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function handleGiftsStatusGet(
  _request: NextRequest,
  code: string
): Promise<NextResponse> {
  const ip =
    _request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const giftCode = await repositories.gift.getByCode(normalizedCode);

    if (!giftCode) {
      return NextResponse.json({ error: "Gift code not found" }, { status: 404 });
    }

    // Return only public-safe fields — no PII
    return NextResponse.json({
      code: giftCode.code,
      status: giftCode.status,
      durationMonths: giftCode.durationMonths,
      expiresAt: giftCode.expiresAt?.toISOString() ?? null,
    });
  } catch (error) {
    logger.error("Failed to fetch gift code status", { code: normalizedCode, error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
