import fs from "fs";
import { groq } from "../Config/groq.js";

const generateTranscript = async (filePath) => {
  try {
    console.log("Generating transcription started : ");

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      // model: 'whisper-large-v3-turbo',
      model: "whisper-large-v3",

      response_format: "text",
      language: "en", // This makes the output English
    });
    return transcription;
  } catch (error) {
    console.log(
      "Error while generating transcript in generateTranscript : ",
      error.message
    );
    throw error;
  }
};

export { generateTranscript };
