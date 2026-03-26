import { NextRequest } from "next/server";
import { handleGiftsRedeemPost } from "@/infrastructure/api-handlers/gifts-redeem-handler";

export async function POST(request: NextRequest) {
  return handleGiftsRedeemPost(request);
}
