import { success } from "@/infrastructure/api/api-response";
import { withApiContext } from "@/infrastructure/api/with-api-context";
import { getCachedHttpResponse, setCachedHttpResponse } from "@/infrastructure/cache/http-response-cache";
import { repositories } from "@/infrastructure/db/repositories";
import { getSessionUserId } from "@/infrastructure/auth/session";
import { FREE_PROTOCOL_LIMIT } from "@/infrastructure/stripe/stripe-client";

export async function GET(request: Request) {
  const traceId = request.headers.get("x-trace-id") ?? undefined;

  return withApiContext("/api/protocol/catalog", async () => {
    const allItems = getCachedHttpResponse<{ items: Awaited<ReturnType<typeof repositories.protocol.listTemplateCatalog>> }>(
      "protocol_catalog"
    );

    let items: Awaited<ReturnType<typeof repositories.protocol.listTemplateCatalog>>;
    if (allItems) {
      items = allItems.items;
    } else {
      items = await repositories.protocol.listTemplateCatalog();
      setCachedHttpResponse("protocol_catalog", { items });
    }

    // Enforce Free tier limit
    const totalCount = items.length;
    const userId = await getSessionUserId();
    let lockedCount = 0;
    if (userId) {
      const user = await repositories.user.getById(userId);
      if (user && user.subscriptionTier === "free") {
        lockedCount = Math.max(0, totalCount - FREE_PROTOCOL_LIMIT);
        items = items.slice(0, FREE_PROTOCOL_LIMIT);
      }
    }

    return success({ items, lockedCount });
  }, { traceId, request });
}
