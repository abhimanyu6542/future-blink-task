import { Request, Response } from "express";
import { callOpenRouter } from "../services/openrouter.service";
import Conversation from "../models/Conversation";

export async function askAI(req: Request, res: Response): Promise<void> {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  try {
    const answer = await callOpenRouter(prompt);
    res.json({ answer });
  } catch (err) {
    console.error("OpenRouter all models failed:", err);
    res.status(502).json({ error: (err as Error).message });
  }
}

export async function saveConversation(req: Request, res: Response): Promise<void> {
  const { prompt, response: aiResponse } = req.body;

  if (!prompt || !aiResponse) {
    res.status(400).json({ error: "Prompt and response are required" });
    return;
  }

  try {
    const conversation = await Conversation.create({ prompt, response: aiResponse });
    res.status(201).json({ message: "Saved successfully", id: conversation._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
}

export async function getHistory(_req: Request, res: Response): Promise<void> {
  try {
    const history = await Conversation.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}
