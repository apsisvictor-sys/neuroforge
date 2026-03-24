import { NextRequest } from "next/server";
import { handleBillingCheckoutPost } from "@/infrastructure/api-handlers/billing-checkout-handler";

export async function POST(request: NextRequest) {
  return handleBillingCheckoutPost(request);
}
