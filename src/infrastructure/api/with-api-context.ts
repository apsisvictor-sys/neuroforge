import { failure } from "@/infrastructure/api/api-response";
import { AppError } from "@/infrastructure/errors/app-error";
import { logger } from "@/infrastructure/logging/logger";
import { createRequestContext, withRequestContext } from "@/infrastructure/logging/request-context";
import { getSessionUserId } from "@/infrastructure/auth/session";
import { enforceRateLimit } from "@/infrastructure/security/rate-limiter";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";
import { generateCsrfToken, verifyCsrfToken } from "@/infrastructure/security/csrf";

function resolveClientIp(request?: Request): string {
  if (!request) {
    return "anonymous";
  }

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const xRealIp = request.headers.get("x-real-ip")?.trim();
  if (xRealIp) return xRealIp;

  return "anonymous";
}

function getCookieValue(request: Request | undefined, name: string): string | undefined {
  if (!request) {
    return undefined;
  }

  const header = request.headers.get("cookie");
  if (!header) {
    return undefined;
  }

  for (const rawSegment of header.split(";")) {
    const segment = rawSegment.trim();
    if (!segment) continue;

    const separatorIndex = segment.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = segment.slice(0, separatorIndex).trim();
    const value = segment.slice(separatorIndex + 1).trim();
    if (!key || key !== name) continue;

    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function buildCsrfCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `csrf_token=${encodeURIComponent(token)}; Path=/; SameSite=Strict; Max-Age=86400${secure}; Priority=High`;
}

function applyCsrfCookie(response: Response, token: string | null): Response {
  if (!token) {
    return response;
  }

  response.headers.append("set-cookie", buildCsrfCookie(token));
  return response;
}

function isStateChangingMethod(method: string | undefined): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

export async function withApiContext(
  routeName: string,
  handler: (ctx: { requestId: string; traceId: string }) => Promise<Response>,
  options?: { traceId?: string; request?: Request }
): Promise<Response> {
  const ctx = createRequestContext(options?.traceId);

  return withRequestContext(ctx, async () => {
    logger.info("API request started", {
      requestId: ctx.requestId,
      traceId: ctx.traceId,
      route: routeName
    });

    let csrfTokenToSet: string | null = null;

    try {
      const userId = await getSessionUserId().catch(() => null);
      const rateLimitIdentifier = userId ?? resolveClientIp(options?.request);

      if (userId && options?.request) {
        const existingCookieToken = getCookieValue(options.request, "csrf_token");
        if (!existingCookieToken || !verifyCsrfToken(existingCookieToken)) {
          csrfTokenToSet = generateCsrfToken();
          noopMetricsRecorder.increment("csrf.generated");
        }
      }

      try {
        await enforceRateLimit(rateLimitIdentifier, {
          windowMs: 60_000,
          maxRequests: 60,
          keyPrefix: "api"
        });
        noopMetricsRecorder.increment("rate_limit.pass");
      } catch (error) {
        if (error instanceof AppError && error.code === "RATE_LIMITED") {
          noopMetricsRecorder.increment("rate_limit.hit");
          logger.warn("Rate limit exceeded", {
            identifier: rateLimitIdentifier,
            route: routeName
          });
        }
        throw error;
      }

      const req = options?.request;
      if (isStateChangingMethod(req?.method) && userId && req) {
        const cookieToken = getCookieValue(req, "csrf_token");
        const headerToken = req.headers.get("x-csrf-token") ?? undefined;

        const isValid =
          typeof cookieToken === "string" &&
          typeof headerToken === "string" &&
          cookieToken.length > 0 &&
          headerToken.length > 0 &&
          cookieToken === headerToken &&
          verifyCsrfToken(cookieToken);

        if (!isValid) {
          noopMetricsRecorder.increment("csrf.fail");
          logger.warn("CSRF validation failed", {
            route: routeName,
            identifier: rateLimitIdentifier
          });
          throw new AppError({
            message: "Invalid CSRF token",
            code: "CSRF_INVALID",
            httpStatus: 403,
            expose: true
          });
        }

        noopMetricsRecorder.increment("csrf.pass");
      }

      const response = await handler({ requestId: ctx.requestId, traceId: ctx.traceId });
      const durationMs = Date.now() - ctx.startTime;
      const completionMeta = {
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        route: routeName,
        status: response.status,
        durationMs
      };

      if (durationMs > 2000) {
        logger.error("API request completed (slow)", { ...completionMeta, slow: true });
      } else if (durationMs > 500) {
        logger.warn("API request completed (slow)", completionMeta);
      } else {
        logger.info("API request completed", completionMeta);
      }

      return applyCsrfCookie(response, csrfTokenToSet);
    } catch (error) {
      const durationMs = Date.now() - ctx.startTime;
      if (error instanceof AppError) {
        logger.error("API request failed (typed)", {
          requestId: ctx.requestId,
          traceId: ctx.traceId,
          route: routeName,
          durationMs,
          code: error.code,
          status: error.httpStatus,
          error: error.message
        });
        return applyCsrfCookie(
          failure(
          error.expose ? error.message : "Internal Server Error",
          error.code,
          error.httpStatus
          ),
          csrfTokenToSet
        );
      }

      logger.error("API request failed", {
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        route: routeName,
        durationMs,
        error: error instanceof Error ? error.message : String(error)
      });
      return applyCsrfCookie(failure("Internal Server Error", "INTERNAL_ERROR", 500), csrfTokenToSet);
    }
  });
}
