from fastapi import APIRouter, Query
from app.models.movie import MovieList
from app.services.movie_service import movie_service

router = APIRouter()

@router.get("/", response_model=MovieList)
async def get_movies():
    """Get all movies"""
    movies = movie_service.scan_movies()
    return MovieList(movies=movies, total=len(movies))

@router.get("/search", response_model=MovieList)
async def search_movies(q: str = Query(..., min_length=1)):
    """Search movies by title"""
    movies = movie_service.search_movies(q)
    return MovieList(movies=movies, total=len(movies))

@router.get("/{movie_id}")
async def get_movie(movie_id: str):
    """Get a specific movie by ID"""
    movie = movie_service.get_movie_by_id(movie_id)
    if not movie:
        return {"error": "Movie not found"}, 404
    return movie
