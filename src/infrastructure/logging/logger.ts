import { getRequestContext } from "@/infrastructure/logging/request-context";

type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  level: LogLevel;
  requestId?: string;
  traceId?: string;
  route?: string;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
};

function write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const requestContext = getRequestContext();

  const payload: LogPayload = {
    level,
    requestId:
      typeof meta?.requestId === "string" ? meta.requestId : requestContext?.requestId,
    traceId: typeof meta?.traceId === "string" ? meta.traceId : requestContext?.traceId,
    route: typeof meta?.route === "string" ? meta.route : undefined,
    message,
    meta,
    timestamp: new Date().toISOString()
  };

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta)
};
