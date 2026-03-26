import { NextRequest } from "next/server";
import { handleGiftsPurchasePost } from "@/infrastructure/api-handlers/gifts-purchase-handler";

export async function POST(request: NextRequest) {
  return handleGiftsPurchasePost(request);
}
