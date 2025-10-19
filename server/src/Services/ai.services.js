import fs from "fs";
import { groq } from "../Config/groq.js";

/* -------------------- 🎧 Transcription -------------------- */
const generateTranscript = async (filePath) => {
  try {
    console.log("Generating transcription...");
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "text",
      language: "en",
    });
    return transcription;
  } catch (error) {
    console.error("Error generating transcript:", error.message);
    throw error;
  }
};

/* -------------------- 🧠 Enhanced System Prompt -------------------- */
const SYSTEM_PROMPT = `
You are **Nova**, a friendly and intelligent AI assistant.

---

### 🎯 Core Principles
1. **Use the retrieval context** for factual and topic-specific questions.
2. **Use the chat history** for remembering what the user already told you
   (for example: name, preferences, project details, or facts stated earlier).
3. If neither provides the answer, respond with:
   > "I don’t know based on the available information."
4. Never invent facts outside of these two sources.
5. Always answer naturally — don’t start with “According to the context”.
6. If user asks something about themselves that was mentioned before (e.g. “What’s my name?”),
   answer from memory confidently, even if the retrieval context doesn’t mention it.

---

### 💬 Example Behavior
Chat history:
> User: My name is Samyak.  
> User: I’m learning JavaScript prototypes.  

Now user asks: “What’s my name?”
→ "Your name is Samyak."

User asks: “What are prototypes?”
→ (If found in retrieval context → answer from there. If not, recall past discussions.)

User asks something unrelated and unseen:
→ "I don’t know based on the available information."
`;

/* -------------------- 💬 Query Function -------------------- */
const queryAI = async (chatHistory, question, context) => {
  const userPrompt = `
User Question:
${question}

Retrieved Context:
${context || "(No factual context retrieved)"}

Instructions:
- Use the retrieval context for topic-specific or factual information.
- Use previous chat messages to recall anything the user already mentioned.
- If both are missing, say "I don’t know based on the available information."
`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userPrompt },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.3,
    max_tokens: 400,
  });

  return completion.choices[0].message.content.trim();
};

export { generateTranscript, queryAI };
