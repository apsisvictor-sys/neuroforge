"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/ui/components/SignOutButton";
import { useSessionStatus } from "@/ui/hooks/use-session-status";

export function AppNav() {
  const { authenticated, loading } = useSessionStatus();
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkStyle = (href: string): { fontWeight: number; textDecoration: string; color: string } => ({
    fontWeight: isActive(href) ? 700 : 400,
    textDecoration: isActive(href) ? "underline" : "none",
    color: isActive(href) ? "#0f172a" : "#334155"
  });

  return (
    <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Link href="/" style={linkStyle("/")}>
        Home
      </Link>
      <Link href="/content" style={linkStyle("/content")}>
        Content
      </Link>

      {!loading && authenticated ? (
        <>
          <Link href="/profile" style={linkStyle("/profile")}>
            Profile
          </Link>
          <Link href="/today" style={linkStyle("/today")}>
            Today
          </Link>
          <Link href="/tracking" style={linkStyle("/tracking")}>
            Tracking
          </Link>
          <Link href="/assistant" style={linkStyle("/assistant")}>
            Assistant
          </Link>
          <Link href="/protocol" style={linkStyle("/protocol")}>
            Protocol
          </Link>
          <SignOutButton />
        </>
      ) : null}

      {!loading && !authenticated ? (
        <Link href="/auth/sign-in" style={linkStyle("/auth/sign-in")}>
          Sign In
        </Link>
      ) : null}
    </nav>
  );
}
