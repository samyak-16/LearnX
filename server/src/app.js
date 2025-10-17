// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { inngestFunctions } from "./inngest/index.js";

import { inngest } from "./Config/inngest.js";
import { serve } from "inngest/express";

// import userRouter from "./Routes/user.route.js";
import { inngestFunctions } from "./Inngest/index.js";
import chatRouter from "./Routes/chat.route.js";
import userRouter from "./Routes/user.route.js";
import messageRouter from "./Routes/message.route.js";
import pythonRouter from "./Routes/python.route.js";

const app = express();

// middlewares
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/python", pythonRouter);

//Inngest route from interacting asynchronously with inngest cloud
app.use(
  "/api/inngest",
  serve({ client: inngest, functions: inngestFunctions })
);
// Export app, don't listen here
export { app };
