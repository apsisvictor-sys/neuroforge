const HTTP_RESPONSE_CACHE_TTL_MS = 30_000;
const HTTP_RESPONSE_CACHE_MAX_SIZE = 5_000;

const httpResponseCache = new Map<
  string,
  {
    response: unknown;
    expiresAt: number;
  }
>();

export function getCachedHttpResponse<T>(key: string): T | undefined {
  const entry = httpResponseCache.get(key);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    httpResponseCache.delete(key);
    return undefined;
  }

  return entry.response as T;
}

export function setCachedHttpResponse<T>(key: string, value: T): void {
  if (!httpResponseCache.has(key) && httpResponseCache.size >= HTTP_RESPONSE_CACHE_MAX_SIZE) {
    const oldestKey = httpResponseCache.keys().next().value;
    if (oldestKey) {
      httpResponseCache.delete(oldestKey);
    }
  }

  httpResponseCache.set(key, {
    response: value,
    expiresAt: Date.now() + HTTP_RESPONSE_CACHE_TTL_MS
  });
}
