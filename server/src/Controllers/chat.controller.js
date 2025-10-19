import { ApiError } from "../Utils/api-error.js";
import { validateYouTubeUrlWithMeta } from "../Utils/validateYoutube.js";
import { Chat } from "../Models/chat.model.js";
import { ApiResponse } from "../Utils/api-response.js";
import { inngest } from "../Config/inngest.js";

const createChat = async (req, res) => {
  const { title = "", chatType = "", youtubeUrl = "" } = req.body || {};

  const file = req.file; // pdf-file from multer
  const user = req.user; // user from authMiddleware

  //Initial Validation starts here
  if (!title || !chatType) {
    return res
      .status(400)
      .json(new ApiError(400, "All necessary fileds are  required"));
  }
  if (!file && !youtubeUrl) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Atleast one chatType be included i.e youtuberl or pdf"
        )
      );
  }

  if (!["pdf", "youtube"].includes(chatType)) {
    return res
      .status(400)
      .json(new ApiError(400, "chatType can only include pdf||youtube"));
  }
  if (chatType === "youtube") {
    if (!youtubeUrl) {
      return res
        .status(400)
        .json(
          new ApiError(400, 'youtubeUrl is required for chatType : "youtube"')
        );
    }
  }
  let videoMetadata;
  if (chatType === "youtube") {
    const result = await validateYouTubeUrlWithMeta(youtubeUrl);
    if (!result.valid) {
      console.log(result.error);

      return res.status(400).json(new ApiError(400, result.error));
    }
    videoMetadata = result.metadata;
  }

  //Initial Validation ends here

  try {
    const chat = new Chat({
      title,
      chatType,
      localPath: chatType === "pdf" ? { pdf: file.path } : undefined,
      youtubeMetaData:
        chatType === "youtube"
          ? {
              url: youtubeUrl,
              title: videoMetadata.title,
              author: videoMetadata.author,
            }
          : undefined,

      pdfMetaData:
        chatType === "pdf"
          ? {
              title: file.originalName,
            }
          : undefined,

      createdBy: user._id,
    });
    //Update User Document

    user.chatsCreated.push(chat._id);
    await user.save();
    await chat.save();

    //Invoke inngest event
    await inngest.send({
      name: "chat/create",
      data: { chatId: chat._id.toString() },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          chat,
        },
        "Chat created successfully. Wait until AI finishes processing."
      )
    );
  } catch (error) {
    console.error("❌ Internal Server Error in createChat : ", error.message);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error at createChat"));
  }
};

export { createChat };
