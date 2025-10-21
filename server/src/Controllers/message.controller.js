// import { inngest } from "../Config/inngest.js";
// import { answerWorkflow } from "../Inngest/functions/on-query.js";
import { vectorStore } from "../Config/vectorStore.js";
import { Chat } from "../Models/chat.model.js";
import { Message } from "../Models/message.model.js";
import { queryAI } from "../Services/ai.services.js";
import { ApiError } from "../Utils/api-error.js";
import { ApiResponse } from "../Utils/api-response.js";
import { validateMongooseObjectId } from "../Utils/validateMongooseObjectId.js";

//Send query as a message   :
const askAI = async (req, res) => {
  const { chatId = "", query = "" } = req.body || {};

  if (!chatId || !query) {
    return res.status(new ApiError(400, "All fields are necessary"));
  }
  if (!validateMongooseObjectId(chatId)) {
    return res.status(
      new ApiError(400, "chatId should be valid moongoose object Id ")
    );
  }
  const senderId = req.user._id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json(new ApiError(404, "Chat not found"));
    }
    const message = new Message({
      chatId,
      senderId,
      senderType: "user",
      content: query,
    });

    await message.save();
    // RAG Context Retrival
    // 3️⃣ RAG context retrieval
    const relevantChunks = await vectorStore.similaritySearch(query, 4, {
      // filter: { chatId: chatId.toString() },
      chatId: chatId.toString(),
    });
    const context = relevantChunks.map((c) => c.pageContent).join("\n\n");

    // 4️⃣ Get last 10 messages (short-term memory)
    const lastMessages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = lastMessages.reverse().map((m) => ({
      role: m.senderType === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    // 5️⃣ Ask AI and save response
    const aiContent = await queryAI(chatHistory, query, context);

    const aiMessage = new Message({
      chatId,
      senderType: "assistant",
      content: aiContent,
    });

    chat.lastMessageId = aiMessage._id;
    await chat.save();
    await aiMessage.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { aiResponse: aiContent },
          "AI responded successfully"
        )
      );
  } catch (error) {
    console.log("Internal Server Error at askAI", error.message);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error at askAI"));
  }
};

//Get Messages for a chat :
const getMessages = async (req, res) => {};

export { askAI };
