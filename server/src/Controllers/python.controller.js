import { Chat } from "../Models/chat.model.js";
import { ApiError } from "../Utils/api-error.js";
import { ApiResponse } from "../Utils/api-response.js";
import { validateMongooseObjectId } from "../Utils/validateMongooseObjectId.js";
const downloadMp3 = async (req, res) => {
  // handle request sent by python microservice
  const file = req.file;
  const { chatId = "" } = req.body || {};
  if (!chatId || !validateMongooseObjectId(chatId)) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Valid chatId is required with proper mongoose object Id"
        )
      );
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json(new ApiError(404, "Chat not found"));
    }
    chat.localPath.mp3 = file.path;
    await chat.save();

    return res.status(
      new ApiResponse(
        200,
        { filePath: file.path },
        "Downloaded Mp3 successfully"
      )
    );
  } catch (error) {
    console.error("Internal Server Error at downloadMp3 : ", error.message);
    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error at downloadMp3"));
  }
};

export { downloadMp3 };
