"use client";

import { TrialBanner } from "@/components/pricing/TrialBanner";

export function TrialBannerClient({ daysRemaining }: { daysRemaining: number }) {
  function handleUpgrade() {
    window.location.href = "/pricing";
  }

  return <TrialBanner daysRemaining={daysRemaining} onUpgradeClick={handleUpgrade} />;
}
