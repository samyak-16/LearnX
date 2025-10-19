import express from "express";
import { askAI } from "../Controllers/message.controller.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/ask-ai", authenticateUser, askAI);

export default router;
