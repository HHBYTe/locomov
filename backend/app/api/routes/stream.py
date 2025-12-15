from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pathlib import Path
from app.services.movie_service import movie_service
from app.services.streaming_service import streaming_service

router = APIRouter()

@router.get("/{movie_id}")
async def stream_movie(movie_id: str):
    """Stream a movie"""
    movie = movie_service.get_movie_by_id(movie_id)
    
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    file_path = Path(movie.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Movie file not found")
    
    file_size = file_path.stat().st_size
    
    return StreamingResponse(
        streaming_service.stream_file(str(file_path)),
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
        }
    )
