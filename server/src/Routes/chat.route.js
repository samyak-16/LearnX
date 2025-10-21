import express from "express";
import {
  createChat,
  getChat,
  getChats,
} from "../Controllers/chat.controller.js";
import { authenticateUser } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create", authenticateUser, upload.single("pdf", 1), createChat);
router.get("/get-chats", authenticateUser, getChats);
router.get("/get-chat", authenticateUser, getChat);

export default router;
