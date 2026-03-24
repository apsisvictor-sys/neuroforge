export type AssistantClientRequest = {
  userText: string;
};

export type AssistantClientResponse = {
  mode: string;
  message: string;
  bullets?: string[];
  safetyFlag?: string;
};

export async function callAssistant(
  req: AssistantClientRequest
): Promise<AssistantClientResponse> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(req)
  });

  if (!res.ok) {
    throw new Error("assistant request failed");
  }

  return res.json();
}
