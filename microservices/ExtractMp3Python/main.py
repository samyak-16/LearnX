# ============================================
# main.py — YouTube MP3 Extractor & Uploader (yt-dlp version, Oct 2025)
# ============================================

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import requests

# ✅ Use yt-dlp instead of LangChain
from yt_dlp import YoutubeDL

# ============================================
# CONFIGURATION
# ============================================

NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:3000/api/python/upload-audio")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

app = FastAPI(title="yt-dlp YouTube Audio Extractor API")

class YouTubeData(BaseModel):
    url: str
    chatId: str

# ============================================
# UTIL — Delete file helper
# ============================================

def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)

# ============================================
# SERVICE — Extract MP3 using yt-dlp
# ============================================

def extract_audio(url: str) -> str:
    """
    Downloads the YouTube audio using yt-dlp.
    Returns the local path to the .mp3 file.
    """
    try:
        # Use safe sanitized title (yt-dlp will handle name collision with -%(id)s if necessary)
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(TEMP_DIR, '%(title)s.%(ext)s'),
            'paths': {'home': TEMP_DIR}
        }
        with YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(result)
        # yt-dlp may output a .mp3 or .webm first, so find the final .mp3 file
        mp3_path = os.path.splitext(filename)[0] + '.mp3'
        if not os.path.exists(mp3_path):
            raise Exception("MP3 file not found after download")
        return mp3_path
    except Exception as e:
        raise Exception(f"Failed to extract audio: {e}")

# ============================================
# SERVICE — Upload to Node.js backend
# ============================================

def send_audio_to_node(file_path: str, chat_id: str):
    with open(file_path, "rb") as f:
        files = {"mp3": (os.path.basename(file_path), f, "audio/mpeg")}
        data = {"chatId": chat_id}
        response = requests.post(NODE_API_URL, files=files, data=data)
    if response.status_code != 200:
        raise Exception(f"Failed to upload to Node API: {response.status_code} - {response.text}")
    return response.json()

# ============================================
# ENDPOINT — POST /extract
# ============================================

@app.post("/extract")
async def extract_audio_endpoint(data: YouTubeData):
    """
    Accepts YouTube URL + chatId, downloads the MP3 via yt-dlp,
    sends it to Node API, then deletes the local file.
    """
    try:
        audio_path = extract_audio(data.url)
        node_response = send_audio_to_node(audio_path, data.chatId)
        delete_file(audio_path)
        return {
            "success": True,
            "message": "Audio extracted and sent successfully!",
            "node_response": node_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# RUN (local)
# ============================================
# Run using: uvicorn main:app --reload
