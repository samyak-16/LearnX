// Chat Collection: Handles BOTH Private & Group Chats

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String, // Custom name for identifing chat with AI / Can be customized by user later
      trim: true,
    },

    youtubeMetaData: {
      type: {
        url: String, //Youtube Video URL
        title: String,
        description: String,
        thumbnail: String, // Cloudinary URL for youtube Thumbnail for better preview
      },
      default: null,
    },

    pdfMetaData: {
      type: {
        url: String, // Cloudinary URL of uploaded PDF
        title: String,
        description: String,
        totalPages: Number,
      },
      default: null,
    },

    chatType: {
      type: String,
      enum: ["pdf", "youtube"], // Can chat with pdf / youtube
      default: null,
    },

    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }, // For showing in history preview
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
