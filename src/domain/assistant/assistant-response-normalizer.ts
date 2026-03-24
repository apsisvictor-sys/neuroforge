import type { AssistantStructuredResponse } from "./assistant-response-schema.ts";

export function normalizeAssistantResponse(
  response: AssistantStructuredResponse
): AssistantStructuredResponse {
  const normalizedBullets =
    typeof response.bullets === "undefined"
      ? undefined
      : response.bullets
          .map((bullet) => bullet.trim())
          .filter((bullet) => bullet.length > 0)
          .slice(0, 5);

  return {
    ...response,
    message: response.message.trim(),
    bullets: normalizedBullets && normalizedBullets.length > 0 ? normalizedBullets : undefined
  };
}
