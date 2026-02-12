import { NextRequest } from "next/server";
import { NeuroforgeAssistantService } from "@/ai/assistant-service/neuroforge-assistant-service";
import { OpenAIProvider } from "@/ai/providers/openai-provider";
import { getTodayView } from "@/application/use-cases/get-today-view";
import { consumeNonce } from "@/infrastructure/auth/nonce";
import { requireUserId } from "@/infrastructure/auth/require-user";
import { repositories } from "@/infrastructure/db/repositories";
import { badRequest, ok, serverError, withApiLogging } from "@/lib/api";
import { requireString } from "@/lib/validate";

const assistantService = new NeuroforgeAssistantService(repositories.conversation, new OpenAIProvider());

export const POST = withApiLogging("/api/assistant/message", "POST", async (request: NextRequest) => {
  try {
    const auth = await requireUserId();
    if ("response" in auth) return auth.response;

    const nonce = request.headers.get("x-nonce");
    if (!nonce || !consumeNonce(auth.userId, nonce)) {
      return badRequest("Invalid nonce");
    }

    const body = await request.json();
    let userMessage: string;
    try {
      userMessage = requireString(String(body.message ?? ""), "message");
    } catch {
      return badRequest("message is required");
    }

    const today = await getTodayView({
      userId: auth.userId,
      now: new Date(),
      userRepository: repositories.user,
      protocolRepository: repositories.protocol,
      trackingRepository: repositories.tracking
    });

    const protocol = await repositories.protocol.getActiveEnrollment(auth.userId);

    const reply = await assistantService.reply({
      userId: auth.userId,
      userMessage,
      context: {
        userId: auth.userId,
        protocolId: protocol?.protocolId ?? "protocol-core-reset-v1",
        phaseId: today.phaseId,
        dayNumber: today.dayNumber,
        todayTasks: today.tasks.map((task) => ({ title: task.title, completed: task.completed })),
        latestCheckin: today.latestCheckin ?? undefined
      }
    });

    return ok(reply);
  } catch (error) {
    return serverError(error);
  }
});
