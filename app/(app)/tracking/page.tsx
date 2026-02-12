import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { TrackingClient } from "./tracking-client";

export default async function TrackingPage() {
  await requireUserPage();
  return <TrackingClient />;
}
