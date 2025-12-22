import os
import re
import subprocess
from typing import List, Optional
from pathlib import Path
from app.config import settings
from app.models.movie import Movie, Subtitle

class MovieService:
    def __init__(self):
        self.movies_path = Path(settings.MOVIES_PATH)
    
    def _get_video_duration(self, file_path: Path) -> Optional[float]:
        """Get video duration in seconds using ffprobe"""
        try:
            result = subprocess.run([
                'ffprobe', '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1',
                str(file_path)
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode == 0:
                return float(result.stdout.strip())
        except Exception as e:
            print(f"Error getting duration for {file_path}: {e}")
        
        return None
    
    def scan_movies(self) -> List[Movie]:
        """Scan the movies directory and return list of movies"""
        movies = []
        
        if not self.movies_path.exists():
            print(f"Movies path does not exist: {self.movies_path}")
            return movies
        
        print(f"Scanning movies in: {self.movies_path}")
        
        for movie_folder in self.movies_path.iterdir():
            if movie_folder.is_dir():
                print(f"Checking folder: {movie_folder}")
                movie = self._create_movie_from_folder(movie_folder)
                if movie:
                    movies.append(movie)
                    print(f"Added movie: {movie.title}")
        
        print(f"Found {len(movies)} movies")
        movies.sort(key=lambda x: x.title.lower())
        return movies
    
    def _create_movie_from_folder(self, folder_path: Path) -> Optional[Movie]:
        """Create a Movie object from a folder"""
        try:
            # Find the video file
            video_file = None
            for file in folder_path.iterdir():
                if file.is_file() and file.suffix.lower() in settings.SUPPORTED_VIDEO_FORMATS:
                    video_file = file
                    break
            
            if not video_file:
                print(f"No video file found in {folder_path}")
                return None
            
            # Parse title and year
            folder_name = folder_path.name
            title, year = self._parse_name(folder_name)
            
            # Get video duration
            duration = self._get_video_duration(video_file)
            
            # Find subtitles
            subtitles = self._find_subtitles(folder_path)
            
            return Movie(
                id=self._generate_id(folder_name),
                title=title,
                year=year,
                folder_name=folder_name,
                file_path=str(video_file),
                size=video_file.stat().st_size,
                duration=duration,
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
                lang_code = self._extract_language(file.stem)
                lang_name = self._get_language_name(lang_code)
                
                subtitles.append(Subtitle(
                    language=lang_name,
                    language_code=lang_code,
                    file_path=str(file),
                    filename=file.name
                ))
        
        return subtitles
    
    def _get_language_name(self, code: str) -> str:
        """Convert language code to full name"""
        lang_map = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ru': 'Russian'
        }
        return lang_map.get(code, code.upper())
    
    def _extract_language(self, filename: str) -> str:
        """Extract language code from filename"""
        lang_patterns = [
            r'\.([a-z]{2,3})$',
            r'[\._]([a-z]{2,3})[\._]',
            r'[\._](english|spanish|french|german|italian)$'
        ]
        
        filename_lower = filename.lower()
        for pattern in lang_patterns:
            match = re.search(pattern, filename_lower)
            if match:
                lang = match.group(1)
                lang_map = {
                    'english': 'en', 'spanish': 'es', 'french': 'fr',
                    'german': 'de', 'italian': 'it'
                }
                return lang_map.get(lang, lang)
        
        return 'unknown'
    
    def _parse_name(self, name: str) -> tuple[str, Optional[str]]:
        """Parse title and year from folder/file name"""
        year_match = re.search(r'\((\d{4})\)', name)
        year = year_match.group(1) if year_match else None
        
        if year:
            title = re.sub(r'\s*\(\d{4}\)\s*', '', name)
        else:
            title = name
        
        title = re.sub(r'[._]', ' ', title)
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
        print(f"Movie {movie_id} not found")
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