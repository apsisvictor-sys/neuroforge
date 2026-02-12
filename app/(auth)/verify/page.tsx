"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { postJson } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

export default function VerifyPage() {
  const search = useSearchParams();
  const initialToken = useMemo(() => search.get("token") ?? "", [search]);
  const [token, setToken] = useState(initialToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });
  const [status, setStatus] = useState("");

  return (
    <main>
      <h2>Verify Magic Link</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSubmitting) return;
          const trimmedToken = token.trim();
          if (!trimmedToken) {
            setFieldError("Token is required");
            return;
          }
          setFieldError(null);
          setIsSubmitting(true);
          try {
            await postJson("/api/auth/verify", { token: trimmedToken });
            setStatus("Session created. You can now use app pages.");
            setFeedback({ type: "success", message: "Verification successful." });
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <input
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
            setFieldError(null);
          }}
          style={{ width: 420 }}
        />
        {fieldError && <p style={{ color: "red" }}>{fieldError}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginLeft: 8 }}>
          Verify
        </button>
      </form>
      <p>{status}</p>
    </main>
  );
}
