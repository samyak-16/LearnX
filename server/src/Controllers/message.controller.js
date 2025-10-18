import { answerWorkflow } from "../Inngest/functions/on-query.js";
import { Chat } from "../Models/chat.model.js";
import { Message } from "../Models/message.model.js";
import { ApiError } from "../Utils/api-error.js";
import { ApiResponse } from "../Utils/api-response.js";
import { validateMongooseObjectId } from "../Utils/validateMongooseObjectId.js";

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

    const aiResponse = await answerWorkflow.trigger({
      data: { messageId: message._id.toString() },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { aiResponse }, "AI responded successfully"));
    res.json(result); // blocks until done
  } catch (error) {
    console.log("Internal Server Error at askAI", error.message);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error at askAI"));
  }
};

export { askAI };
