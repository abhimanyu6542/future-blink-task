const BASE = "/api";

export async function askAI(prompt: string): Promise<string> {
  const res = await fetch(`${BASE}/ask-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = (await res.json()) as { answer?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data.answer ?? "";
}

export async function saveConversation(prompt: string, response: string): Promise<void> {
  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, response }),
  });

  if (!res.ok) throw new Error("Save failed");
}

export async function getHistory(): Promise<{ prompt: string; response: string; createdAt: string }[]> {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}
