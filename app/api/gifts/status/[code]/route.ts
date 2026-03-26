import { NextRequest } from "next/server";
import { handleGiftsStatusGet } from "@/infrastructure/api-handlers/gifts-status-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  return handleGiftsStatusGet(request, code);
}
