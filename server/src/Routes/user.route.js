import express from "express";

import { authenticateUser } from "../Middlewares/auth.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);

export default router;
