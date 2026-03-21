"use client";

import { useState } from "react";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";
import { EmptyState } from "@/ui/components/EmptyState";
import { callAssistant, type AssistantClientResponse } from "@/ui/assistant/assistant-client";

type Message = { role: "user" | "assistant"; content: string };

export function AssistantClient() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastResponse, setLastResponse] = useState<AssistantClientResponse | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  return (
    <main>
      <h2>Assistant</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      {messages.length === 0 && !isTyping ? (
        <EmptyState message="No messages yet" description="Ask your Neuroforge coach anything about your protocol or nervous system." />
      ) : (
        <ul>
          {messages.map((message, index) => (
            <li key={`${message.role}-${index}`}>
              <strong>{message.role}:</strong> {message.content}
            </li>
          ))}
          {isTyping ? <li style={{ color: "#6b7280", fontStyle: "italic" }}>Assistant is typing…</li> : null}
        </ul>
      )}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSending) return;
          const userMessage = input.trim();
          if (!userMessage) {
            setFeedback({ type: "info", message: "Please enter a message before sending." });
            return;
          }

          setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
          setInput("");
          setIsSending(true);
          setIsTyping(true);
          try {
            const response = await callAssistant({ userText: userMessage });

            setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
            setLastResponse(response);
            setFeedback({ type: "success", message: "Message sent." });
          } catch (error) {
            setFeedback({ type: "error", message: (error as Error).message });
          } finally {
            setIsSending(false);
            setIsTyping(false);
          }
        }}
      >
        <input value={input} onChange={(event) => setInput(event.target.value)} style={{ width: 420 }} />
        <button type="submit" disabled={isSending} style={{ marginLeft: 8 }}>
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>
      {lastResponse?.bullets && lastResponse.bullets.length > 0 ? (
        <section>
          <p>Suggested steps:</p>
          <ul>
            {lastResponse.bullets.map((bullet, index) => (
              <li key={`${bullet}-${index}`}>{bullet}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {lastResponse?.safetyFlag === "escalation" ? (
        <p style={{ color: "#b91c1c", fontWeight: 600 }}>Safety escalation guidance is active.</p>
      ) : null}
      {lastResponse?.safetyFlag === "refusal" ? (
        <p style={{ color: "#374151" }}>This request is outside assistant safety constraints.</p>
      ) : null}
    </main>
  );
}
