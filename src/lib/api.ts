import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logger } from "@/infrastructure/logging/logger";

export function ok<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 200 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function serverError(error: unknown): NextResponse {
  logger.error("API request failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

type ApiHandler = (...args: any[]) => Promise<NextResponse> | NextResponse;

export function withApiLogging(path: string, method: string, handler: ApiHandler): ApiHandler {
  return async (...args: any[]) => {
    const start = Date.now();
    const request = args[0] as NextRequest | undefined;
    const resolvedMethod = request?.method ?? method;
    const resolvedPath = request?.nextUrl?.pathname ?? path;

    const response = await handler(...args);
    logger.info("API request", {
      method: resolvedMethod,
      path: resolvedPath,
      status: response.status,
      durationMs: Date.now() - start
    });

    return response;
  };
}
