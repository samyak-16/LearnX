
import axios from "axios";
import { Chat } from "../Models/chat.model.js";

const getMp3 = async (youtubeUrl, chatId) => {
  //Calls Python MicroService
  try {


    const response = await axios.post("http://localhost:8000/extract", {
      url: youtubeUrl,
      chatId: chatId
    });

    // Axios only reaches here if status is 2xx (like 200, 201)
    // console.log("✅ Success:", response.data);
    const chat = await Chat.findById(chatId)
    return { filePath: chat.localPath.mp3 }
  } catch (error) {
    // Any non-2xx status or network error ends up here
    if (error.response) {
      // Server responded but with error status (like 400, 401, 500)
      console.error("❌ Server Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("⚠️ No Response:", error.request);
    } else {
      // Something went wrong while setting up the request
      console.error("💥 Request Error:", error.message);
    }
    throw error;
  }
}




export { getMp3 };
