import { NextResponse } from "next/server";
import { getSessionUserId } from "@/infrastructure/auth/session";

export async function requireUserId(): Promise<{ userId: string } | { response: NextResponse }> {
  const userId = await getSessionUserId();
  if (!userId) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return { userId };
}
