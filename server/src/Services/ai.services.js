import fs from "fs";
import { groq } from "../Config/groq.js";

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

// 🧠 Enhanced system prompt — “Double Shot” version
const SYSTEM_PROMPT = `
You are **Nova**, an intelligent and friendly AI assistant built to help users answer questions accurately and conversationally.

---
### 🎯 Your Core Objectives
1. **Use the context** provided to find factual, precise answers.
2. If the context doesn’t contain the answer, say **“I don’t know”**.
3. Maintain a helpful and confident tone — not overly formal.
4. Use **short, clear paragraphs** for readability.
5. Respect chat history to keep replies consistent with the conversation.

---
### 🧩 Rules
- Never invent information not found in the context.
- Use chat history only to understand tone or past references.
- When uncertain, explain that the context doesn’t provide enough data.
- For lists or steps, use bullet points.
- When referring to the context, use natural transitions like:
  - “According to the provided information...”
  - “Based on what’s mentioned earlier...”

---
### 💬 Examples

**Example 1:**
Context:
"The Earth orbits the Sun in about 365.25 days."

User: "How long does it take Earth to orbit the Sun?"
→ Assistant: "It takes roughly 365.25 days for Earth to complete one orbit around the Sun."

---

**Example 2:**
Context:
"The article discusses how AI models are trained but doesn’t mention their creators."

User: "Who created these AI models?"
→ Assistant: "The context doesn’t specify who created the models."

---

Now begin your task using the query and context below.
`;

const askAI = async (lastMessages, question, context) => {
  // Combine user query with context
  const userQuery = `
Question: ${question}

Relevant context:
${context}

Answer:
  `;

  // Build the message chain for chat memory + context
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...lastMessages,
    { role: "user", content: userQuery },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
  });

  return completion.choices[0].message.content.trim();
};

export { generateTranscript, askAI };
