import os
import re
from typing import List, Optional
from pathlib import Path
from app.config import settings
from app.models.movie import Movie, Subtitle

class MovieService:
    def __init__(self):
        self.movies_path = Path(settings.MOVIES_PATH)
    
    def scan_movies(self) -> List[Movie]:
        """Scan the movies directory and return list of movies"""
        movies = []
        
        if not self.movies_path.exists():
            print(f"Movies path does not exist: {self.movies_path}")
            return movies
        
        print(f"Scanning movies in: {self.movies_path}")
        
        # Each movie is in its own folder
        for movie_folder in self.movies_path.iterdir():
            if movie_folder.is_dir():
                print(f"Checking folder: {movie_folder}")
                movie = self._create_movie_from_folder(movie_folder)
                if movie:
                    movies.append(movie)
                    print(f"Added movie: {movie.title}")
        
        print(f"Found {len(movies)} movies")
        # Sort alphabetically by title
        movies.sort(key=lambda x: x.title.lower())
        return movies
    
    def _create_movie_from_folder(self, folder_path: Path) -> Optional[Movie]:
        """Create a Movie object from a folder"""
        try:
            # Find the video file in the folder
            video_file = None
            for file in folder_path.iterdir():
                if file.is_file() and file.suffix.lower() in settings.SUPPORTED_VIDEO_FORMATS:
                    video_file = file
                    break
            
            if not video_file:
                print(f"No video file found in {folder_path}")
                return None
            
            # Parse title and year from folder name
            folder_name = folder_path.name
            title, year = self._parse_name(folder_name)
            
            # Find subtitles
            subtitles = self._find_subtitles(folder_path)
            
            return Movie(
                id=self._generate_id(folder_name),
                title=title,
                year=year,
                folder_name=folder_name,
                file_path=str(video_file),
                size=video_file.stat().st_size,
                subtitles=subtitles
            )
        except Exception as e:
            print(f"Error processing folder {folder_path}: {e}")
            return None
    
    def _find_subtitles(self, folder_path: Path) -> List[Subtitle]:
        """Find all subtitle files in a folder"""
        subtitles = []
        
        for file in folder_path.iterdir():
            if file.is_file() and file.suffix.lower() in settings.SUPPORTED_SUBTITLE_FORMATS:
                language = self._extract_language(file.stem)
                subtitles.append(Subtitle(
                    language=language,
                    file_path=str(file),
                    filename=file.name
                ))
        
        return subtitles
    
    def _extract_language(self, filename: str) -> str:
        """Extract language code from filename (e.g., 'movie.en.srt' -> 'en')"""
        # Common patterns: movie.en.srt, movie.eng.srt, movie_english.srt
        lang_patterns = [
            r'\.([a-z]{2,3})$',  # .en, .eng
            r'[\._]([a-z]{2,3})[\._]',  # _en_, .en.
            r'[\._](english|spanish|french|german|italian)$'
        ]
        
        filename_lower = filename.lower()
        for pattern in lang_patterns:
            match = re.search(pattern, filename_lower)
            if match:
                lang = match.group(1)
                # Map full names to codes
                lang_map = {
                    'english': 'en', 'spanish': 'es', 'french': 'fr',
                    'german': 'de', 'italian': 'it'
                }
                return lang_map.get(lang, lang)
        
        return 'unknown'
    
    def _parse_name(self, name: str) -> tuple[str, Optional[str]]:
        """Parse title and year from folder/file name"""
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
    
    def _generate_id(self, name: str) -> str:
        """Generate a unique ID from name"""
        return re.sub(r'[^a-zA-Z0-9]', '_', name).lower()
    
    def get_movie_by_id(self, movie_id: str) -> Optional[Movie]:
        """Get a specific movie by ID"""
        movies = self.scan_movies()
        for movie in movies:
            if movie.id == movie_id:
                print(f"Found movie {movie_id}: {movie.file_path}")
                return movie
        print(f"Movie {movie_id} not found. Available movies: {[m.id for m in movies]}")
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
