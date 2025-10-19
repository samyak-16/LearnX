import { Chat } from "../../Models/chat.model.js";
import { inngest } from "../../Config/inngest.js";
import { cleanTempFile } from "../../Utils/cleanTempFile.js";
import { parsePDF } from "../../Utils/parsePDF.js";
import { generateTranscript } from "../../Services/ai.services.js";
import { NonRetriableError } from "inngest";
import { uploadOnCloudinary } from "../../Utils/uploadToCloudinary.js";
import { getMp3 } from "../../Utils/getMp3.js";

export const onCreateChat = inngest.createFunction(
  {
    id: "on-create-chat",
    retries: 2,
  },
  { event: "chat/create" },
  async ({ event, step }) => {
    const { chatId } = event.data;
    try {
      // Pipeline starts

      const chat = await step.run("get-chat-document-object", async () => {
        const chatDoc = await Chat.findById(chatId);
        chatDoc.status = "processing";
        await chatDoc.save();
        return chatDoc;
      });
      console.log("Chat Fetched succesfully ");

      if (!chat) {
        console.log("Can't find chat so its nonRetriableError");

        throw NonRetriableError;
      }

      if (chat.chatType === "pdf") {
        //Pipeline For pdf
        console.log("Inside pfd pipeline");

        await step.run("upload-to-cloudinary", async () => {
          const result = await uploadOnCloudinary(chat.localPath.pdf);

          if (!result) {
            throw new Error(
              "Error while uploading to cloudinary , retrying .."
            );
          }
          const url = result.url;
          await Chat.findByIdAndUpdate(chatId, {
            pdfMetaData: {
              url,
            },
          });
        });

        // Converts pdf to chunks and save to vector db :)
        await step.run("save-and-process-pdf", async () => {
          const { noOfChunksMade } = await parsePDF(chat.localPath.pdf, chatId);
          await Chat.findByIdAndUpdate(chatId, {
            pdfMetaData: {
              noOfChunksMade,
            },
            status: "completed",
          });
        });

        console.log("Chat saved to database Ssuccessfully ");

        await step.run("clean-temp-pdf", async () => {
          await cleanTempFile(chat.localPath.pdf);
        });
        console.log("Removed temp pdf .");
      } else {
        //Pipeline For youtubeVideo
        console.log("Inside youtube video pipeline");
        const { filePath } = await step.run(
          "process-audio-and-save-as-mp3",
          async () => {
            //it calls python microservice , generates mp3 ,sends to node via another api-endpoint and saves the Filepath to db . and returns a filePath using multer .
            return await getMp3(chat.youtubeMetaData.url);
          }
        );

        const transcript = await step.run("generate-transcript", async () => {
          return await generateTranscript(filePath);
        });

        console.log("Transcript generated succesfully from the mp3");

        // Converts pdf to chunks and save to vector db :)
        await step.run("save-and-process-transcript", async () => {
          const { noOfChunksMade } = await processTranscript({
            metadata: chat.youtubeMetaData,
            transcript,
            chatId,
          });
          await Chat.findByIdAndUpdate(chatId, {
            youtubeMetaData: {
              noOfChunksMade,
            },
            status: "completed",
          });
        });

        await step.run("clean-temp-mp3", async () => {
          await cleanTempFile(chat.localPath.mp3);
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error in running the pipeline : ", error.message);

      const chat = await chat.findByIdAndUpdate(quizId, { status: "failed" });

      try {
        if (chat.chatType === "pdf") {
          if (chat.localPath.pdf) {
            await cleanTempFile(chat.localPath.pdf);
          }
        } else {
          if (chat.localPath.mp3) {
            await cleanTempFile(chat.localPath.mp3);
          }
        }
      } catch (cleanupError) {
        console.error("Failed to clean temp file:", cleanupError.message);
      }
      return { success: false };
    }
  }
);
