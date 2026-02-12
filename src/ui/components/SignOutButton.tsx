"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          await fetch("/api/auth/sign-out", { method: "POST" });
          router.push("/auth/sign-in");
          router.refresh();
        } finally {
          setIsSubmitting(false);
        }
      }}
      disabled={isSubmitting}
      style={{ background: "none", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}
    >
      Sign Out
    </button>
  );
}
