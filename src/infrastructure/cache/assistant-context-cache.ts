import type { AssistantContextInput } from "@/application/assistant/assistant-context-input";

const ASSISTANT_CONTEXT_TTL_MS = 15_000;
const ASSISTANT_CONTEXT_CACHE_MAX_SIZE = 5_000;

const assistantContextCache = new Map<
  string,
  {
    value: AssistantContextInput;
    expiresAt: number;
  }
>();

export function getAssistantContext(userId: string): AssistantContextInput | undefined {
  const entry = assistantContextCache.get(userId);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt <= Date.now()) {
    assistantContextCache.delete(userId);
    return undefined;
  }

  return entry.value;
}

export function setAssistantContext(userId: string, context: AssistantContextInput): void {
  if (!assistantContextCache.has(userId) && assistantContextCache.size >= ASSISTANT_CONTEXT_CACHE_MAX_SIZE) {
    const oldestKey = assistantContextCache.keys().next().value;
    if (oldestKey) {
      assistantContextCache.delete(oldestKey);
    }
  }

  assistantContextCache.set(userId, {
    value: context,
    expiresAt: Date.now() + ASSISTANT_CONTEXT_TTL_MS
  });
}
