import { redirect } from "next/navigation";
import { getSessionUserId } from "@/infrastructure/auth/session";

export async function requireUserPage(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/auth/sign-in");
  }

  return userId;
}
