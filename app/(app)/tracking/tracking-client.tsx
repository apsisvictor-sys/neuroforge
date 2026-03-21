"use client";

import { useEffect, useState } from "react";
import { getJson, postJsonWithNonce } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";
import { LoadingSpinner } from "@/ui/components/LoadingSpinner";
import { EmptyState } from "@/ui/components/EmptyState";

type HistoryItem = {
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
};

export function TrackingClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focus, setFocus] = useState(5);
  const [calm, setCalm] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getJson<{ history: HistoryItem[] }>("/api/tracking/history");
      setHistory(response.history);
    } finally {
      setIsLoading(false);
      setHasLoadedOnce(true);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const dayKey = new Date().toISOString().slice(0, 10);

  if (isLoading && !hasLoadedOnce) {
    return <LoadingSpinner label="Loading history..." />;
  }

  return (
    <main>
      <h2>Tracking</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSubmitting) return;
          setIsSubmitting(true);
          try {
            await postJsonWithNonce("/api/tracking/daily", { dayKey, focus, calm, energy });
            setFeedback({ type: "success", message: "Check-in saved." });
            await loadHistory();
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <label>
          Focus: {focus}
          <input type="range" min={0} max={10} value={focus} onChange={(e) => setFocus(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Calm: {calm}
          <input type="range" min={0} max={10} value={calm} onChange={(e) => setCalm(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Energy: {energy}
          <input type="range" min={0} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
        </label>
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Daily Check-in"}
        </button>
      </form>
      <h3>History</h3>
      {history.length === 0 ? (
        <EmptyState message="No check-ins yet" description="Your daily tracking history will appear here." />
      ) : null}
      <ul>
        {history.map((item) => (
          <li key={item.dayKey}>
            {item.dayKey}: F{item.focus} / C{item.calm} / E{item.energy}
          </li>
        ))}
      </ul>
    </main>
  );
}
