import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { ProgressDashboard } from "@/components/progress/ProgressDashboard";

export default async function ProgressPage() {
  await requireUserPage();
  return (
    <main>
      <h2>Progress</h2>
      <ProgressDashboard />
    </main>
  );
}
