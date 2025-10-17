import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../Config/vectorStore.js";
import fs from "fs";

async function parsePDF(filePath, chatId) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();
  //   doc[0];
  //   console.log(doc[0].pageContent);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const texts = await textSplitter.splitText(doc[0].pageContent);

  const documents = texts.map((chunks) => {
    return {
      pageContent: chunks,
      metadata: { ...doc[0].metadata, chatId },
    };
  });
  // console.log(documents);

  // Save to vector db
  await vectorStore.addDocuments(documents);

  return {
    noOfChunksMade: texts.length,
  };
}

export { parsePDF };
