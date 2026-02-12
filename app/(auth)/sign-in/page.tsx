"use client";

import { useState } from "react";
import { postJson } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  return (
    <main>
      <h2>Sign In</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSubmitting) return;
          const trimmedEmail = email.trim();
          if (!trimmedEmail) {
            setFieldError("Email is required");
            return;
          }
          setFieldError(null);
          setIsSubmitting(true);
          try {
            const response = await postJson<{ debugMagicLink: string }>("/api/auth/request-link", { email: trimmedEmail });
            setFeedback({
              type: "success",
              message: `Magic link generated (dev): ${response.debugMagicLink}`
            });
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <input
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldError(null);
          }}
          style={{ marginRight: 8 }}
        />
        {fieldError && <p style={{ color: "red" }}>{fieldError}</p>}
        <button type="submit" disabled={isSubmitting}>
          Send Magic Link
        </button>
      </form>
      <p>Open the magic link and then submit its token on the verify page.</p>
    </main>
  );
}
