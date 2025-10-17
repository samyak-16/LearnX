import express from "express";

import { upload } from "../Middlewares/multer.middleware";
import { downloadMp3 } from "../Controllers/python.controller";

const router = express.Router();

router.post("get-mp3", upload.single("mp3", 1), downloadMp3);

export default router;
