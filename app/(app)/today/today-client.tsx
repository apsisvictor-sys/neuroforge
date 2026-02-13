"use client";

import { useEffect, useState } from "react";
import { getJson, postJsonWithNonce } from "@/ui/hooks/use-api";
import { TodayProtocolHeader } from "@/components/today/TodayProtocolHeader";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

type TodayResponse = {
  dayKey: string;
  dayNumber: number;
  phaseName: string;
  tasks: { id: string; title: string; completed: boolean; required: boolean }[];
  completion: { completedCount: number; totalCount: number; score: number };
  streak: number;
};

type ProtocolCurrentResponse = {
  protocol: { name: string; slug: string } | null;
};

export function TodayClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [data, setData] = useState<TodayResponse | null>(null);
  const [protocolContext, setProtocolContext] = useState<{ title: string; slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingTasks, setPendingTasks] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  const reload = async () => {
    setIsLoading(true);
    try {
      const response = await getJson<TodayResponse>("/api/today");
      setData(response);
      try {
        const protocolResponse = await getJson<ProtocolCurrentResponse>("/api/protocol/current");
        setProtocolContext(
          protocolResponse.protocol
            ? { title: protocolResponse.protocol.name, slug: protocolResponse.protocol.slug }
            : null
        );
      } catch {
        setProtocolContext(null);
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      setHasLoadedOnce(true);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  if (isLoading && !hasLoadedOnce) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h2>Today</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      {error ? <p>{error}</p> : null}
      {data ? (
        <>
          {protocolContext ? (
            <TodayProtocolHeader title={protocolContext.title} slug={protocolContext.slug} />
          ) : (
            <p>No active protocol</p>
          )}
          <p>
            Day {data.dayNumber} | Phase: {data.phaseName} | Streak: {data.streak}
          </p>
          <p>
            Completion: {data.completion.completedCount}/{data.completion.totalCount} ({Math.round(data.completion.score * 100)}%)
          </p>
          {data.tasks.length === 0 ? <p>No tasks for today</p> : null}
          <ul>
            {data.tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={Boolean(pendingTasks[task.id])}
                    onChange={async () => {
                      if (pendingTasks[task.id]) return;
                      setPendingTasks((prev) => ({ ...prev, [task.id]: true }));
                      try {
                        await postJsonWithNonce(`/api/tasks/${task.id}/toggle`, {});
                        await reload();
                        setFeedback({ type: "success", message: "Task updated." });
                      } catch (err) {
                        setFeedback({ type: "error", message: (err as Error).message });
                      } finally {
                        setPendingTasks((prev) => ({ ...prev, [task.id]: false }));
                      }
                    }}
                  />
                  {task.title} {task.required ? "(required)" : ""}
                </label>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
