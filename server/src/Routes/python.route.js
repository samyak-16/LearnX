import express from "express";

import { upload } from "../Middlewares/multer.middleware.js";
import { downloadMp3 } from "../Controllers/python.controller.js";

const router = express.Router();

router.post("/upload-audio", upload.single("mp3", 1), downloadMp3);

export default router;
