import { inngest } from "../../Config/inngest.js";
import { vectorStore } from "../../Config/vectorStore.js";
import { Message } from "../../Models/message.model.js";
import { askAI } from "../../Services/ai.services.js";

export const answerWorkflow = inngest.createFunction(
  {
    id: "on-query",
    retries: 2,
  },
  {
    event: "question/asked",
  },
  async ({ event, step }) => {
    const { messageId } = event.data;

    try {
      const message = await Message.findById(messageId);
      if (!message) throw new Error("Message not found");

      const chatId = message.chatId;
      const query = message.content;

      // 🔹 1. RAG context retrieval
      const context = await step.run("retrieval-of-context", async () => {
        const relevantChunks = await vectorStore.similaritySearch(query, 4, {
          filter: { chatId }, // 👈 filter by chatId
        });

        return relevantChunks.map((c) => c.pageContent).join("\n\n");
      });

      // 🔹 2. Get last 10 chat messages (short-term memory)
      const lastMessages = await step.run("get-last-messages", async () => {
        const messages = await Message.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        return messages.reverse().map((m) => ({
          role: m.senderType === "assistant" ? "assistant" : "user",
          content: m.content,
        }));
      });

      // 🔹 3. Ask the AI (combine history + context + current query)
      const aiResponse = await step.run(
        "get-ai-response-and-save-to-db",
        async () => {
          const content = await askAI(lastMessages, query, context);

          const aiMessage = new Message({
            chatId,
            senderType: "assistant",
            content,
          });
          await aiMessage.save();

          return content;
        }
      );

      return aiResponse;
    } catch (err) {
      console.error("Error in answerWorkflow:", err.message);
      throw err;
    }
  }
);
