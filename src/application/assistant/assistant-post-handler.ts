import { buildAssistantContext } from "../../domain/assistant/assistant-context-builder.ts";
import { assembleAssistantPrompt } from "../../domain/assistant/assistant-prompt-assembly.ts";
import { selectAssistantReplyMode } from "../../domain/assistant/assistant-mode-selector.ts";
import { normalizeAssistantResponse } from "../../domain/assistant/assistant-response-normalizer.ts";
import { isAssistantStructuredResponse } from "../../domain/assistant/assistant-response-schema.ts";
import type { AssistantPromptTrace } from "../../domain/assistant/assistant-prompt-trace.ts";
import type { AssistantModelAdapter } from "../../domain/assistant/assistant-model-adapter.ts";
import type { AssistantContextInput } from "./assistant-context-input.ts";
import { buildAssistantContextInput } from "./assistant-context-provider.ts";

const REFUSAL_MESSAGE =
  "I can’t help with that request. I can support you with safe protocol guidance and adherence steps instead.";
const ESCALATION_MESSAGE =
  "I’m concerned about your safety. Please contact a qualified professional or your local emergency service right now. If you can, reach out to someone you trust.";

export async function handleAssistantPost(
  body: { userText?: unknown } | null,
  adapter: AssistantModelAdapter,
  userId: string,
  contextInput?: AssistantContextInput,
  options?: { includeTrace?: boolean }
) {
  const resolvedInput = contextInput ?? (await buildAssistantContextInput(userId, null));
  const context = buildAssistantContext(resolvedInput);

  const userText =
    typeof body?.userText === "string" ? body.userText : undefined;

  const mode = selectAssistantReplyMode({
    context,
    userText
  });

  const prompt = assembleAssistantPrompt(context, mode);
  const promptTrace: AssistantPromptTrace = {
    mode,
    systemLength: prompt.system.length,
    templateLength: prompt.modeTemplate.length,
    contextLength: prompt.contextBlock.length
  };

  const response = await adapter.generateResponse({
    system: prompt.system,
    userPrompt: prompt.combinedUserPrompt
  });

  const responseWithOverrides =
    mode === "safety_refusal"
      ? { ...response, message: REFUSAL_MESSAGE, bullets: undefined }
      : mode === "escalation_guidance"
        ? { ...response, message: ESCALATION_MESSAGE, bullets: undefined }
        : response;

  const responseWithSafetyFlag = {
    ...responseWithOverrides,
    safetyFlag:
      mode === "escalation_guidance"
        ? "escalation"
        : mode === "safety_refusal"
          ? "refusal"
          : (responseWithOverrides.safetyFlag ?? "none")
  };
  const normalizedResponse = normalizeAssistantResponse(responseWithSafetyFlag);

  if (!isAssistantStructuredResponse(normalizedResponse)) {
    return { status: 500, payload: { error: "Invalid assistant response shape" } };
  }

  if (options?.includeTrace === true) {
    return { status: 200, payload: { ...normalizedResponse, _trace: promptTrace } };
  }

  return { status: 200, payload: normalizedResponse };
}
