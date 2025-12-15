import os
import re
from typing import List, Optional
from pathlib import Path
from app.config import settings
from app.models.movie import Movie

class MovieService:
    def __init__(self):
        self.media_path = Path(settings.MEDIA_PATH)
    
    def scan_movies(self) -> List[Movie]:
        """Scan the media directory and return list of movies"""
        movies = []
        
        if not self.media_path.exists():
            return movies
        
        for file_path in self.media_path.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in settings.SUPPORTED_FORMATS:
                movie = self._create_movie_from_file(file_path)
                if movie:
                    movies.append(movie)
        
        # Sort alphabetically by title
        movies.sort(key=lambda x: x.title.lower())
        return movies
    
    def _create_movie_from_file(self, file_path: Path) -> Optional[Movie]:
        """Create a Movie object from a file"""
        try:
            filename = file_path.name
            title, year = self._parse_filename(filename)
            
            return Movie(
                id=self._generate_id(filename),
                title=title,
                year=year,
                filename=filename,
                file_path=str(file_path),
                size=file_path.stat().st_size
            )
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")
            return None
    
    def _parse_filename(self, filename: str) -> tuple[str, Optional[str]]:
        """Parse movie title and year from filename"""
        # Remove extension
        name = Path(filename).stem
        
        # Try to extract year in parentheses
        year_match = re.search(r'\((\d{4})\)', name)
        year = year_match.group(1) if year_match else None
        
        # Remove year from title
        if year:
            title = re.sub(r'\s*\(\d{4}\)\s*', '', name)
        else:
            title = name
        
        # Replace underscores and dots with spaces
        title = re.sub(r'[._]', ' ', title)
        
        # Clean up multiple spaces
        title = re.sub(r'\s+', ' ', title).strip()
        
        return title, year
    
    def _generate_id(self, filename: str) -> str:
        """Generate a unique ID from filename"""
        return re.sub(r'[^a-zA-Z0-9]', '_', Path(filename).stem).lower()
    
    def get_movie_by_id(self, movie_id: str) -> Optional[Movie]:
        """Get a specific movie by ID"""
        movies = self.scan_movies()
        for movie in movies:
            if movie.id == movie_id:
                return movie
        return None
    
    def search_movies(self, query: str) -> List[Movie]:
        """Search movies by title"""
        movies = self.scan_movies()
        query_lower = query.lower()
        
        return [
            movie for movie in movies
            if query_lower in movie.title.lower()
        ]

movie_service = MovieService()
