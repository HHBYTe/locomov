from pydantic import BaseModel
from typing import Optional

class Movie(BaseModel):
    id: str
    title: str
    year: Optional[str] = None
    filename: str
    file_path: str
    size: int
    duration: Optional[float] = None

class MovieList(BaseModel):
    movies: list[Movie]
    total: int
