"use client";

import { useEffect, useState } from "react";
import { getJson, postJson } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

export function ProfileClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [workRhythm, setWorkRhythm] = useState("morning");
  const [windowPref, setWindowPref] = useState("09:00-11:00");
  const [profileFieldError, setProfileFieldError] = useState<{ displayName: string | null; timezone: string | null }>({
    displayName: null,
    timezone: null
  });
  const [onboardingFieldError, setOnboardingFieldError] = useState<{
    workRhythm: string | null;
    windowPref: string | null;
  }>({
    workRhythm: null,
    windowPref: null
  });
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await getJson<{ profile: { displayName: string; timezone: string } | null }>("/api/profile");
        if (data.profile) {
          setDisplayName(data.profile.displayName);
          setTimezone(data.profile.timezone);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <main>
      <h2>Profile & Onboarding</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSavingProfile) return;
          const trimmedDisplayName = displayName.trim();
          const trimmedTimezone = timezone.trim();
          const nextErrors = {
            displayName: trimmedDisplayName ? null : "Display name is required",
            timezone: trimmedTimezone ? null : "Timezone is required"
          };
          if (nextErrors.displayName || nextErrors.timezone) {
            setProfileFieldError(nextErrors);
            return;
          }
          setProfileFieldError({ displayName: null, timezone: null });
          setIsSavingProfile(true);
          try {
            const response = await fetch("/api/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ displayName: trimmedDisplayName, timezone: trimmedTimezone })
            });
            if (!response.ok) {
              throw new Error("Failed to save profile");
            }
            setFeedback({ type: "success", message: "Profile saved." });
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSavingProfile(false);
          }
        }}
      >
        <label>
          Display name
          <input
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setProfileFieldError((prev) => ({ ...prev, displayName: null }));
            }}
          />
        </label>
        {profileFieldError.displayName ? <p style={{ color: "red" }}>{profileFieldError.displayName}</p> : null}
        <br />
        <label>
          Timezone
          <input
            value={timezone}
            onChange={(event) => {
              setTimezone(event.target.value);
              setProfileFieldError((prev) => ({ ...prev, timezone: null }));
            }}
          />
        </label>
        {profileFieldError.timezone ? <p style={{ color: "red" }}>{profileFieldError.timezone}</p> : null}
        <br />
        <button type="submit" disabled={isSavingProfile}>
          Save Profile
        </button>
      </form>

      <h3>Onboarding</h3>
      <p>Step 1 of 1 — Onboarding</p>
      <p>Tell us your preferred working rhythm so Neuroforge can tailor your daily guidance.</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSavingOnboarding) return;
          const trimmedWorkRhythm = workRhythm.trim();
          const trimmedWindowPref = windowPref.trim();
          const nextErrors = {
            workRhythm: trimmedWorkRhythm ? null : "Work rhythm is required",
            windowPref: trimmedWindowPref ? null : "Preferred training window is required"
          };
          if (nextErrors.workRhythm || nextErrors.windowPref) {
            setOnboardingFieldError(nextErrors);
            return;
          }
          setOnboardingFieldError({ workRhythm: null, windowPref: null });
          setIsSavingOnboarding(true);
          try {
            await postJson("/api/onboarding", {
              workRhythm: trimmedWorkRhythm,
              overwhelmTriggers: ["context switching"],
              preferredTrainingWindow: trimmedWindowPref,
              focusFrictionPatterns: ["notifications"]
            });
            setFeedback({ type: "success", message: "Onboarding saved." });
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSavingOnboarding(false);
          }
        }}
      >
        <label>
          Work rhythm
          <input
            value={workRhythm}
            onChange={(event) => {
              setWorkRhythm(event.target.value);
              setOnboardingFieldError((prev) => ({ ...prev, workRhythm: null }));
            }}
          />
        </label>
        {onboardingFieldError.workRhythm ? <p style={{ color: "red" }}>{onboardingFieldError.workRhythm}</p> : null}
        <br />
        <label>
          Preferred training window
          <input
            value={windowPref}
            onChange={(event) => {
              setWindowPref(event.target.value);
              setOnboardingFieldError((prev) => ({ ...prev, windowPref: null }));
            }}
          />
        </label>
        {onboardingFieldError.windowPref ? <p style={{ color: "red" }}>{onboardingFieldError.windowPref}</p> : null}
        <br />
        <button type="submit" disabled={isSavingOnboarding}>
          Save Onboarding
        </button>
      </form>
    </main>
  );
}
