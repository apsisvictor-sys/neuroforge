import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { TodayClient } from "./today-client";

export default async function TodayPage() {
  await requireUserPage();
  return <TodayClient />;
}
