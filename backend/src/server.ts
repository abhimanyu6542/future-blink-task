import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Conversation from "./models/Conversation";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected on"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Free models to try in order — if one fails/rate-limits, fallback to next
const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

async function callOpenRouter(prompt: string): Promise<string> {
  let lastError = "";

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

      const data = await response.json() as {
        choices: { message: { content: string } }[];
      };

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

// POST /api/ask-ai
app.post("/api/ask-ai", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const answer = await callOpenRouter(prompt);
    return res.json({ answer });
  } catch (err) {
    console.error("OpenRouter all models failed:", err);
    return res.status(502).json({ error: (err as Error).message });
  }
});

// POST /api/save
app.post("/api/save", async (req: Request, res: Response) => {
  const { prompt, response: aiResponse } = req.body;

  if (!prompt || !aiResponse) {
    return res.status(400).json({ error: "Prompt and response are required" });
  }

  try {
    const conversation = await Conversation.create({ prompt, response: aiResponse });
    return res.status(201).json({ message: "Saved successfully", id: conversation._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save" });
  }
});

// GET /api/history
app.get("/api/history", async (_req: Request, res: Response) => {
  try {
    const history = await Conversation.find().sort({ createdAt: -1 }).limit(20);
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
