"use client";

import { useState } from "react";
import { callAssistant, type AssistantClientResponse } from "./assistant-client";

export function AssistantTestPanel() {
  const [userText, setUserText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AssistantClientResponse | null>(null);

  const handleSend = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await callAssistant({ userText });
      setLastResponse(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <textarea value={userText} onChange={(event) => setUserText(event.target.value)} />
      <button type="button" onClick={handleSend} disabled={isLoading}>
        Send
      </button>

      {lastResponse ? (
        <div>
          <p>{lastResponse.message}</p>
          {lastResponse.bullets ? (
            <ul>
              {lastResponse.bullets.map((bullet, index) => (
                <li key={`${bullet}-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {lastResponse.safetyFlag ? <p>{lastResponse.safetyFlag}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
