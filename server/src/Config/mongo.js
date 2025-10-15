import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Success connecting to MongoDB");
    })
    .catch((err) => {
      console.log("❌ Connecting to MongoDB failed  : ", err.message);
      process.exit(1);
    });
};

export { mongodb };
