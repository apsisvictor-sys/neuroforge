import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  await requireUserPage();
  return <ProfileClient />;
}
