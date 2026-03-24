import { NextRequest } from "next/server";
import { handleStripeWebhookPost } from "@/infrastructure/api-handlers/stripe-webhook-handler";

export async function POST(request: NextRequest) {
  return handleStripeWebhookPost(request);
}
