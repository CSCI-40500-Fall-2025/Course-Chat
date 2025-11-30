import express from "express";
import { summarizeMessages } from "../controllers/mlController.js";

const router = express.Router();

router.get("/chats/:courseId/summarizer", summarizeMessages);

export default router;
