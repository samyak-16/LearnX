import express from "express";
import { createChat } from "../Controllers/chat.controller";
import { authenticateUser } from "../Middlewares/auth.middleware";
import { upload } from "../Middlewares/multer.middleware";

const router = express.Router();

router.post(
  "create-chat",
  authenticateUser,
  upload.single("pdf", 1),
  createChat
);

export default router;
