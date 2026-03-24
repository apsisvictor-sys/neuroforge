import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

type RequestContext = {
  requestId: string;
  traceId: string;
  startTime: number;
};

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function generateRequestId(): string {
  return randomUUID();
}

export function generateTraceId(): string {
  return randomUUID();
}

export function createRequestContext(traceId?: string): {
  requestId: string;
  traceId: string;
  startTime: number;
} {
  return {
    requestId: generateRequestId(),
    traceId: traceId ?? generateTraceId(),
    startTime: Date.now()
  };
}

export function withRequestContext<T>(context: RequestContext, fn: () => T): T {
  return requestContextStorage.run(context, fn);
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}
