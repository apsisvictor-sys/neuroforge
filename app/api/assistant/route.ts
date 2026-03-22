import { handleAssistantPost } from "@/application/assistant/assistant-post-handler";
import { buildAssistantContextInput } from "@/application/assistant/assistant-context-provider";
import { resolveAssistantModelAdapter } from "@/infrastructure/assistant/assistant-model-adapter-resolver";
import { withApiContext } from "@/infrastructure/api/with-api-context";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { AI_COACH_MONTHLY_FREE_LIMIT } from "@/infrastructure/auth/access-control";
import { getAssistantContext, setAssistantContext } from "@/infrastructure/cache/assistant-context-cache";
import { repositories } from "@/infrastructure/db/repositories";
import { enqueueJob } from "@/infrastructure/jobs/enqueue-job";
import { noopMetricsRecorder } from "@/infrastructure/metrics/noop-metrics-recorder";
import { enforceRateLimit } from "@/infrastructure/security/rate-limiter";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const traceId = request.headers.get("x-trace-id") ?? undefined;
  return withApiContext("/api/assistant", async () => {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    // Enforce AI coach rate limit for Free tier users (5 messages/month)
    const user = await repositories.user.getById(auth.userId);
    if (user?.subscriptionTier === "free") {
      await enforceRateLimit(auth.userId, {
        windowMs: THIRTY_DAYS_MS,
        maxRequests: AI_COACH_MONTHLY_FREE_LIMIT,
        keyPrefix: "ai_coach",
      });
    }

    const body = await request.json().catch(() => null);
    const includeTrace =
      request.headers.get("x-neuroforge-assistant-trace") === "1";
    const contextInput =
      getAssistantContext(auth.userId) ??
      (await (async () => {
        const computed = await buildAssistantContextInput(auth.userId, repositories.protocol, {
          trackingRepository: repositories.tracking,
          userRepository: repositories.user,
          userStateRepository: repositories.userState
        });
        setAssistantContext(auth.userId, computed);
        return computed;
      })());

    noopMetricsRecorder.increment("assistant.request");

    try {
      const result = await handleAssistantPost(
        body,
        resolveAssistantModelAdapter(),
        auth.userId,
        contextInput,
        { includeTrace }
      );

      if (result.status >= 400) {
        noopMetricsRecorder.increment("assistant.error");
      } else {
        await enqueueJob("assistant.summarize_conversation", {
          userId: auth.userId
        });
      }

      return Response.json(result.payload, { status: result.status });
    } catch (error) {
      noopMetricsRecorder.increment("assistant.error");
      throw error;
    }
  }, { traceId, request });
}
