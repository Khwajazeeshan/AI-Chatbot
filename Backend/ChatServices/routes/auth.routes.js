import express from "express";
import { UserChats } from "../controllers/UserChats.controller.js";
import { getChatHistory, getConversation, deleteConversation, deleteAllChats } from "../controllers/ChatHistory.controller.js";
import { verifyToken } from "../middleware/VerifyToken.js";


const router = express.Router();

router.post("/chat", UserChats);
router.get("/history", verifyToken, getChatHistory);
router.get("/history/:id", verifyToken, getConversation);
router.delete("/history/:id", verifyToken, deleteConversation);
router.delete("/history", verifyToken, deleteAllChats);


export default router;