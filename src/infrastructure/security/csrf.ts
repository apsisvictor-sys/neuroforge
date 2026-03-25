import { createHmac, timingSafeEqual } from "node:crypto";

const CSRF_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET?.trim();
  if (!secret) {
    throw new Error("CSRF_SECRET is required at startup");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getCsrfSecret()).update(payload).digest("base64");
}

export function generateCsrfToken(): string {
  const payload = String(Date.now());
  const payloadBase64 = Buffer.from(payload, "utf8").toString("base64");
  const signatureBase64 = sign(payload);
  return `${payloadBase64}.${signatureBase64}`;
}

export function verifyCsrfToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [payloadBase64, signatureBase64] = parts;
  let payload: string;
  try {
    payload = Buffer.from(payloadBase64, "base64").toString("utf8");
  } catch {
    return false;
  }

  const timestamp = Number.parseInt(payload, 10);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const now = Date.now();
  if (timestamp > now || now - timestamp > CSRF_MAX_AGE_MS) {
    return false;
  }

  const expectedSignature = sign(payload);
  const provided = Buffer.from(signatureBase64, "base64");
  const expected = Buffer.from(expectedSignature, "base64");
  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}
