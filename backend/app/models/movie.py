from pydantic import BaseModel, Field
from typing import Optional, List

class Subtitle(BaseModel):
    language: str  # Keep as code for now
    language_code: str = ""  # Add this field
    file_path: str
    filename: str
    
    def __init__(self, **data):
        super().__init__(**data)
        # Auto-populate language_code if not provided
        if not self.language_code and self.language:
            self.language_code = self.language

class Movie(BaseModel):
    id: str
    title: str
    year: Optional[str] = None
    folder_name: str
    file_path: str
    size: int
    duration: Optional[float] = None
    length: Optional[str] = None  # Add formatted length for frontend
    subtitles: List[Subtitle] = []
    
    def __init__(self, **data):
        super().__init__(**data)
        # Auto-generate length from duration if available
        if self.duration and not self.length:
            self.length = self._format_duration(self.duration)
    
    @staticmethod
    def _format_duration(seconds: float) -> str:
        """Format duration in seconds to 'Xh Ym' format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"

class Episode(BaseModel):
    id: str
    season: int
    episode: int
    title: Optional[str] = None
    file_path: str
    size: int
    duration: Optional[float] = None
    length: Optional[str] = None  # Add formatted length
    subtitles: List[Subtitle] = []
    
    def __init__(self, **data):
        super().__init__(**data)
        # Auto-generate length from duration if available
        if self.duration and not self.length:
            self.length = Movie._format_duration(self.duration)

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