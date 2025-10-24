// Chat Collection: Handles BOTH Private & Group Chats

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String, // Custom title for identifing chat with AI / Can be customized by user later
      trim: true,
    },
    localPath: {
      type: {
        pdf: {
          type: String,
        },
        mp3: {
          type: String,
        },
      },
      default: {}
    },

    chatType: {
      type: String,
      enum: ["pdf", "youtube"], // Can chat with pdf / youtube
      default: null,
    },
    youtubeMetaData: {
      type: {
        url: String, //Youtube Video URL
        title: String,
        author: String,
        // description: String, // AI generated
        thumbnail: String, // Cloudinary URL for youtube Thumbnail for better preview
        noOfChunksMade: String, //Using LangChain
      },
      default: null,
    },
    pdfMetaData: {
      type: {
        url: String, // Cloudinary URL of uploaded PDF
        title: String,
        // description: String, // AI generated
        // totalPages: Number,
        noOfChunksMade: String, //Using LangChain
      },
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      // Example Flow With Status

      // User uploads a PDF || Youtube Video → status = "pending"

      // Backend starts transcription → update status = "processing"

      // Converts to chunks -> still status = "processing"

      // chat processed successfully and ready for chatting → update status = "completed"

      // If any error occurs → status = "failed"
    },

    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }, // For showing in history preview
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
