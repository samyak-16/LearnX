import express from "express";

import { authenticateUser } from "../Middlewares/auth.middleware";

const router = express.Router();

router.post("send-message", authenticateUser, sendMessage);

export default router;
