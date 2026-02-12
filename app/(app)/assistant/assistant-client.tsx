"use client";

import { useState } from "react";
import { postJsonWithNonce } from "@/ui/hooks/use-api";
import { FeedbackBanner } from "@/ui/components/FeedbackBanner";

type Message = { role: "user" | "assistant"; content: string };

export function AssistantClient() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string | null }>({
    type: "info",
    message: null
  });

  return (
    <main>
      <h2>Assistant</h2>
      <FeedbackBanner type={feedback.type} message={feedback.message} />
      <ul>
        {messages.length === 0 && !isTyping ? <li>No messages yet</li> : null}
        {messages.map((message, index) => (
          <li key={`${message.role}-${index}`}>
            <strong>{message.role}:</strong> {message.content}
          </li>
        ))}
        {isTyping ? <li>Assistant is typing...</li> : null}
      </ul>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isSending) return;
          const userMessage = input.trim();
          if (!userMessage) return;

          setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
          setInput("");
          setIsSending(true);
          setIsTyping(true);
          try {
            const response = await postJsonWithNonce<{ message: string }>("/api/assistant/message", {
              message: userMessage
            });

            setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
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
          Send
        </button>
      </form>
    </main>
  );
}
