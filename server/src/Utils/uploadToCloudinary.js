import fs from "fs";
import path from "path";
import { cloudinary } from "../Config/cloudinary.js";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (!fs.existsSync(localFilePath)) {
      console.error("File does not exist:", localFilePath);
      return null;
    }

    // Get file extension
    const ext = path.extname(localFilePath).toLowerCase();

    // Choose resource type based on file type
    const resourceType = ext === ".pdf" ? "raw" : "auto";

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
