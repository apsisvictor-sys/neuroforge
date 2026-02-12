"use client";

export async function postJson<T>(url: string, body: unknown, headers?: HeadersInit): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getNonce(): Promise<string> {
  const response = await getJson<{ nonce: string }>("/api/auth/nonce");
  return response.nonce;
}

export async function postJsonWithNonce<T>(url: string, body: unknown): Promise<T> {
  const nonce = await getNonce();
  return postJson<T>(url, body, { "x-nonce": nonce });
}
