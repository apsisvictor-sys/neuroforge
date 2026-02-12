import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { AssistantClient } from "./assistant-client";

export default async function AssistantPage() {
  await requireUserPage();
  return <AssistantClient />;
}
