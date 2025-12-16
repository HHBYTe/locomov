from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from pathlib import Path
from app.services.movie_service import movie_service
from app.services.series_service import series_service
from app.services.streaming_service import streaming_service

router = APIRouter()

@router.get("/movie/{movie_id}")
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

@router.get("/episode/{episode_id}")
async def stream_episode(episode_id: str):
    """Stream an episode"""
    episode = series_service.get_episode_by_id(episode_id)
    
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    file_path = Path(episode.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Episode file not found")
    
    file_size = file_path.stat().st_size
    
    return StreamingResponse(
        streaming_service.stream_file(str(file_path)),
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
        }
    )

@router.get("/subtitle/{subtitle_type}/{item_id}/{subtitle_filename}")
async def get_subtitle(subtitle_type: str, item_id: str, subtitle_filename: str):
    """Get subtitle file for movie or episode"""
    if subtitle_type == "movie":
        item = movie_service.get_movie_by_id(item_id)
    elif subtitle_type == "episode":
        item = series_service.get_episode_by_id(item_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid subtitle type")
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Find the subtitle file
    subtitle_path = None
    for subtitle in item.subtitles:
        if subtitle.filename == subtitle_filename:
            subtitle_path = Path(subtitle.file_path)
            break
    
    if not subtitle_path or not subtitle_path.exists():
        raise HTTPException(status_code=404, detail="Subtitle not found")
    
    return FileResponse(
        subtitle_path,
        media_type="text/vtt" if subtitle_path.suffix == ".vtt" else "text/plain"
    )
