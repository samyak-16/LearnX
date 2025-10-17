import multer from "multer";
import fs from "fs";

// Define main folders
const mainFolders = ["uploads/tempPdf", "uploads/tempYoutubeAudio"];
mainFolders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    // Check mimetype
    if (file.mimetype === "application/pdf") {
      folder = "uploads/tempPdf";
    } else if (
      file.mimetype === "audio/mpeg" ||
      file.mimetype === "audio/mp3"
    ) {
      folder = "uploads/tempYoutubeAudio";
    } else {
      return cb(new Error("Invalid file type! Only PDF or MP3 allowed"), false);
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Optional file filter (extra validation)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/mp3"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only PDF or MP3 files are allowed!"),
      false
    );
  }
};

// Create the multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file
});

export { upload };
