import { handleAssistantPost } from "@/application/assistant/assistant-post-handler";
import { buildAssistantContextInput } from "@/application/assistant/assistant-context-provider";
import { resolveAssistantModelAdapter } from "@/infrastructure/assistant/assistant-model-adapter-resolver";
import { withApiContext } from "@/infrastructure/api/with-api-context";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { getAssistantContext, setAssistantContext } from "@/infrastructure/cache/assistant-context-cache";
import { repositories } from "@/infrastructure/db/repositories";

export async function POST(request: Request) {
  const traceId = request.headers.get("x-trace-id") ?? undefined;
  return withApiContext("/api/assistant/probe", async () => {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const body = await request.json().catch(() => null);
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

    const result = await handleAssistantPost(
      body,
      resolveAssistantModelAdapter(),
      auth.userId,
      contextInput,
      { includeTrace: true }
    );

    return Response.json(result.payload, { status: result.status });
  }, { traceId, request });
}
