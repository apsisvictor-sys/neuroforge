import type { NextRequest } from "next/server";
import { failure, success } from "@/infrastructure/api/api-response";
import { withApiContext } from "@/infrastructure/api/with-api-context";
import { logger } from "@/infrastructure/logging/logger";

export function ok<T>(data: T) {
  return success(data);
}

export function badRequest(message: string) {
  return failure(message, "BAD_REQUEST", 400);
}

export function unauthorized() {
  return failure("Unauthorized", "UNAUTHORIZED", 401);
}

export function serverError(error: unknown) {
  logger.error("API request failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  return failure("Internal Server Error", "INTERNAL_ERROR", 500);
}

type ApiHandler = (...args: any[]) => Promise<Response> | Response;

export function withApiLogging(path: string, method: string, handler: ApiHandler): ApiHandler {
  return async (...args: any[]) => {
    const request = args[0] as NextRequest | undefined;
    const resolvedMethod = request?.method ?? method;
    const resolvedPath = request?.nextUrl?.pathname ?? path;
    const traceId = request?.headers.get("x-trace-id") ?? undefined;

    const response = await withApiContext(`${resolvedMethod} ${resolvedPath}`, async () => {
      const result = await Promise.resolve(handler(...args));
      return result;
    }, { traceId, request });

    return response;
  };
}
