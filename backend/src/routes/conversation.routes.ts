import { Router } from "express";
import { askAI, saveConversation, getHistory } from "../controllers/conversation.controller";

const router = Router();

router.post("/ask-ai", askAI);
router.post("/save", saveConversation);
router.get("/history", getHistory);

export default router;
