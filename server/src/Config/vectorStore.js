import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { env } from "./env.js";

//   const text = "I love you";
const embeddings = new CohereEmbeddings({
  model: "embed-english-v3.0",
});
//   const vector = await embeddings.embedQuery(text);
//   console.log("Vector", vector);
//   const docs = ["I love you", "I hate you", "I like programming"];

//   const vectors = await embeddings.embedDocuments(docs);

//   console.log("Vectors", vectors[0].length); // 1024 dimensions

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.index(env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});
