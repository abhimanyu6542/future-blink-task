import { FREE_MODELS, OPENROUTER_API_KEY, OPENROUTER_BASE_URL } from "../config/constants";

interface OpenRouterResponse {
  choices: { message: { content: string } }[];
}

export async function callOpenRouter(prompt: string): Promise<string> {
  let lastError = "";

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "MERN AI Flow",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (response.status === 429 || !response.ok) {
        const errText = await response.text();
        console.warn(`Model ${model} failed (${response.status}):`, errText);
        lastError = errText;
        continue;
      }

      const data = (await response.json()) as OpenRouterResponse;
      const answer = data.choices?.[0]?.message?.content;

      if (answer) {
        console.log(`Responded using model: ${model}`);
        return answer;
      }
    } catch (err) {
      console.warn(`Model ${model} threw:`, err);
      lastError = (err as Error).message;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`);
}
