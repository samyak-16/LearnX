import express from "express";
import { createChat } from "../Controllers/chat.controller.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "create-chat",
  authenticateUser,
  upload.single("pdf", 1),
  createChat
);

export default router;
