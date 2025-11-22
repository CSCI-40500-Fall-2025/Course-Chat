import express from "express";
import { deleteMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.get("/chats/:courseId/messages", getMessages);
router.delete("/chats/:courseId/:messageId", deleteMessage);

export default router;
