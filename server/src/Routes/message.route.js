import express from "express";
import { sendMessage } from "../Controllers/message.controller.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("send-message", authenticateUser, sendMessage);

export default router;
