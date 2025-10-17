import dotenv from "dotenv";
dotenv.config();

const env = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,

  MAILTRAP: {
    HOST: process.env.MAILTRAP_SMTP_HOST,
    PORT: process.env.MAILTRAP_SMTP_PORT,
    USER: process.env.MAILTRAP_SMTP_USER,
    PASS: process.env.MAILTRAP_SMTP_PASS,
  },
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PORT: process.env.PORT,
};

export { env };
