import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Movie Streaming Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Media settings
    MEDIA_PATH: str = os.getenv("MEDIA_PATH", "/app/media/movies")
    SUPPORTED_FORMATS: List[str] = [".mp4", ".mkv", ".avi", ".mov", ".webm"]
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost").split(",")
    
    # Streaming
    CHUNK_SIZE: int = 1024 * 1024  # 1MB chunks

settings = Settings()
