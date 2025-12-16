from pydantic import BaseModel
from typing import Optional, List

class Subtitle(BaseModel):
    language: str
    file_path: str
    filename: str

class Movie(BaseModel):
    id: str
    title: str
    year: Optional[str] = None
    folder_name: str
    file_path: str
    size: int
    duration: Optional[float] = None
    subtitles: List[Subtitle] = []

class Episode(BaseModel):
    id: str
    season: int
    episode: int
    title: Optional[str] = None
    file_path: str
    size: int
    duration: Optional[float] = None
    subtitles: List[Subtitle] = []

class Season(BaseModel):
    season_number: int
    episodes: List[Episode]

class Series(BaseModel):
    id: str
    title: str
    year: Optional[str] = None
    folder_name: str
    seasons: List[Season]
    total_episodes: int

class MovieList(BaseModel):
    movies: List[Movie]
    total: int

class SeriesList(BaseModel):
    series: List[Series]
    total: int
