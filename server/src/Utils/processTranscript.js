import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../Config/vectorStore.js";
async function processTranscript(transcript, chatId, metadata) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const texts = await textSplitter.splitText(transcript);

  const documents = texts.map((chunks) => {
    return {
      pageContent: chunks,
      metadata: { ...metadata, chatId },
    };
  });
  // console.log(documents);

  // Save to vector db
  await vectorStore.addDocuments(documents);

  return {
    noOfChunksMade: texts.length,
  };
}

export { processTranscript };
