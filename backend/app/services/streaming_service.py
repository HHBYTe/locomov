from pathlib import Path
from typing import AsyncIterator
from app.config import settings

class StreamingService:
    @staticmethod
    async def stream_file(file_path: str, start: int = 0, end: int = None) -> AsyncIterator[bytes]:
        """Stream video file in chunks"""
        path = Path(file_path)
        file_size = path.stat().st_size
        
        if end is None:
            end = file_size - 1
        
        with open(path, 'rb') as video:
            video.seek(start)
            remaining = end - start + 1
            
            while remaining > 0:
                chunk_size = min(settings.CHUNK_SIZE, remaining)
                data = video.read(chunk_size)
                if not data:
                    break
                remaining -= len(data)
                yield data

streaming_service = StreamingService()
