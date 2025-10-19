import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["user", "assistant"], // who sent the message
      required: true,
    },
    senderId: {
      type: String, // userId from auth service
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
