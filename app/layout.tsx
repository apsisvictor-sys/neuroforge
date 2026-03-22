import type { ReactNode } from "react";
import { ErrorBoundary } from "@/ui/components/ErrorBoundary";
import { AppNav } from "@/ui/components/AppNav";
import { TrialBannerWrapper } from "@/ui/components/TrialBannerWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: "0 auto", maxWidth: 960, padding: 24 }}>
        <TrialBannerWrapper />
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>Neuroforge</h1>
          <p style={{ marginTop: 4 }}>Regulation and focus restoration protocol trainer</p>
          <AppNav />
        </header>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
