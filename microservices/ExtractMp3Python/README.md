# 🎵 YouTube MP3 Extractor & Uploader (yt-dlp + FastAPI)

> **Version:** Oct 2025
> **Author:** Samyak Raj Subedi
> **Description:**
> A FastAPI-based microservice that extracts audio from a YouTube video using `yt-dlp`, converts it to `.mp3`, and uploads it to a Node.js backend API.

---

## 🚀 Features

- Extracts high-quality MP3 audio from YouTube links using **yt-dlp**
- Converts downloaded audio via **FFmpeg**
- Sends the resulting MP3 file to a **Node.js backend API**
- Cleans up temporary files automatically
- Fully asynchronous FastAPI-based architecture

---

## ⚙️ Project Overview

### 📁 Folder Structure

```bash
.
├── main.py              # Core FastAPI application
├── requirements.txt     # Python dependencies
├── temp/                # Temporary directory for audio files
└── README.md            # Documentation
```

### 🧩 API Endpoint Overview

| Method | Endpoint   | Description                                                           |
| ------ | ---------- | --------------------------------------------------------------------- |
| POST   | `/extract` | Accepts YouTube URL + `chatId`, extracts audio, sends to Node backend |

#### Example Request Body

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "chatId": "12345"
}
```

#### Example Response Body

```json
{
  "success": true,
  "message": "Audio extracted and sent successfully!",
  "node_response": { "status": "uploaded" }
}
```

---

## 🧰 Prerequisites

- Python 3.9+
- pip (Python package manager)
- FFmpeg (required by yt-dlp for audio conversion)

### 🖥️ Install FFmpeg (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install ffmpeg
```

## 📦 Setup Instructions

### 2️⃣ Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate   # On Linux / macOS
venv\Scripts\activate      # On Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Set Environment Variable

Update your Node backend endpoint if necessary:

```bash
export NODE_API_URL="http://localhost:3000/api/python/upload-audio"
```

### ▶️ Run the Server

Using Uvicorn:

```bash
uvicorn main:app --reload
```

The app will start at:

```
http://127.0.0.1:8000
```

### Test with curl or Postman

**POST** `http://127.0.0.1:8000/extract`

```json
{
  "url": "https://www.youtube.com/watch?v=xxxx",
  "chatId": "abc123" //Works only with integration to node API (Only in this project)
}
```

---

## 🧠 How It Works (High-Level Flow)

1. Client sends a YouTube URL and `chatId` to the FastAPI endpoint `/extract`.
2. `yt-dlp` downloads the best available audio stream.
3. FFmpeg (used internally by `yt-dlp`) converts it to `.mp3`.
4. FastAPI uploads the MP3 to the Node.js backend via HTTP POST.
5. The file is deleted locally after successful upload.

---

## 🧾 Example Output in Console

```text
INFO:     127.0.0.1:50322 - "POST /extract HTTP/1.1" 200 OK
Audio extracted and sent successfully!
```

---

## 🧹 Cleanup

Temporary MP3 files are automatically removed after each upload, ensuring minimal disk usage.

---

## 🧑‍💻 Developer Notes

- Change the Node backend URL in `.env` or environment variable if running on a remote server.
- The `temp/` folder is created automatically.
- Uses **Pydantic** for input validation and type safety.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.
