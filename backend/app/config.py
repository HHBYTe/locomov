import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Movie Streaming Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Media settings
    MOVIES_PATH: str = os.getenv("MOVIES_PATH", "/app/media/movies")
    SERIES_PATH: str = os.getenv("SERIES_PATH", "/app/media/series")
    SUPPORTED_VIDEO_FORMATS: List[str] = [".mp4", ".mkv", ".avi", ".mov", ".webm"]
    SUPPORTED_SUBTITLE_FORMATS: List[str] = [".srt", ".vtt", ".ass", ".ssa"]
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost").split(",")
    
    # Streaming
    CHUNK_SIZE: int = 1024 * 1024  # 1MB chunks

settings = Settings()
