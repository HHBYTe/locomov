import os
import re
from typing import List, Optional
from pathlib import Path
from app.config import settings
from app.models.movie import Series, Season, Episode, Subtitle

class SeriesService:
    def __init__(self):
        self.series_path = Path(settings.SERIES_PATH)
    
    def scan_series(self) -> List[Series]:
        """Scan the series directory and return list of series"""
        all_series = []
        
        if not self.series_path.exists():
            return all_series
        
        # Each series is in its own folder
        for series_folder in self.series_path.iterdir():
            if series_folder.is_dir():
                series = self._create_series_from_folder(series_folder)
                if series:
                    all_series.append(series)
        
        # Sort alphabetically by title
        all_series.sort(key=lambda x: x.title.lower())
        return all_series
    
    def _create_series_from_folder(self, folder_path: Path) -> Optional[Series]:
        """Create a Series object from a folder"""
        try:
            folder_name = folder_path.name
            title, year = self._parse_name(folder_name)
            
            # Scan for seasons
            seasons = self._scan_seasons(folder_path)
            
            if not seasons:
                return None
            
            total_episodes = sum(len(season.episodes) for season in seasons)
            
            return Series(
                id=self._generate_id(folder_name),
                title=title,
                year=year,
                folder_name=folder_name,
                seasons=seasons,
                total_episodes=total_episodes
            )
        except Exception as e:
            print(f"Error processing series folder {folder_path}: {e}")
            return None
    
    def _scan_seasons(self, series_folder: Path) -> List[Season]:
        """Scan for season folders and episodes"""
        seasons_dict = {}
        
        # Look for season folders (e.g., Season 1, S01, etc.)
        for item in series_folder.iterdir():
            if item.is_dir():
                season_num = self._extract_season_number(item.name)
                if season_num:
                    episodes = self._scan_episodes(item, season_num)
                    if episodes:
                        seasons_dict[season_num] = Season(
                            season_number=season_num,
                            episodes=episodes
                        )
        
        # If no season folders found, check for episodes directly in series folder
        if not seasons_dict:
            episodes = self._scan_episodes(series_folder, 1)
            if episodes:
                seasons_dict[1] = Season(season_number=1, episodes=episodes)
        
        # Convert to sorted list
        return [seasons_dict[k] for k in sorted(seasons_dict.keys())]
    
    def _scan_episodes(self, folder: Path, season_num: int) -> List[Episode]:
        """Scan a folder for episode files"""
        episodes = []
        
        for item in folder.iterdir():
            if item.is_file() and item.suffix.lower() in settings.SUPPORTED_VIDEO_FORMATS:
                episode = self._create_episode(item, season_num)
                if episode:
                    episodes.append(episode)
        
        # Sort by episode number
        episodes.sort(key=lambda x: x.episode)
        return episodes
    
    def _create_episode(self, file_path: Path, season_num: int) -> Optional[Episode]:
        """Create an Episode object from a file"""
        try:
            filename = file_path.stem
            episode_num = self._extract_episode_number(filename)
            
            if not episode_num:
                return None
            
            title = self._extract_episode_title(filename, season_num, episode_num)
            
            # Find subtitles in the same directory
            subtitles = self._find_episode_subtitles(file_path)
            
            episode_id = f"s{season_num:02d}e{episode_num:02d}_{self._generate_id(file_path.parent.parent.name)}"
            
            return Episode(
                id=episode_id,
                season=season_num,
                episode=episode_num,
                title=title,
                file_path=str(file_path),
                size=file_path.stat().st_size,
                subtitles=subtitles
            )
        except Exception as e:
            print(f"Error processing episode {file_path}: {e}")
            return None
    
    def _find_episode_subtitles(self, video_file: Path) -> List[Subtitle]:
        """Find subtitle files matching the episode"""
        subtitles = []
        video_stem = video_file.stem
        
        for file in video_file.parent.iterdir():
            if file.is_file() and file.suffix.lower() in settings.SUPPORTED_SUBTITLE_FORMATS:
                # Check if subtitle matches this video file
                if file.stem.startswith(video_stem) or video_stem in file.stem:
                    language = self._extract_language(file.stem)
                    subtitles.append(Subtitle(
                        language=language,
                        file_path=str(file),
                        filename=file.name
                    ))
        
        return subtitles
    
    def _extract_season_number(self, folder_name: str) -> Optional[int]:
        """Extract season number from folder name"""
        patterns = [
            r'[Ss]eason[\s._-]*(\d+)',
            r'[Ss](\d+)',
            r'^(\d+)$'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, folder_name)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_episode_number(self, filename: str) -> Optional[int]:
        """Extract episode number from filename"""
        patterns = [
            r'[Ee](\d+)',  # E01, e01
            r'[Ee]pisode[\s._-]*(\d+)',  # Episode 01
            r'[\s._-](\d+)[\s._-]',  # _01_ or .01.
            r'^(\d+)[\s._-]'  # Starting with number
        ]
        
        for pattern in patterns:
            match = re.search(pattern, filename)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_episode_title(self, filename: str, season: int, episode: int) -> Optional[str]:
        """Extract episode title from filename"""
        # Remove common patterns
        cleaned = filename
        
        # Remove season/episode markers
        patterns = [
            rf'[Ss]{season:02d}[Ee]{episode:02d}',
            rf'[Ss]eason[\s._-]*{season}[\s._-]*[Ee]pisode[\s._-]*{episode}',
            rf'[Ee]{episode:02d}',
            rf'[Ee]pisode[\s._-]*{episode}'
        ]
        
        for pattern in patterns:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
        
        # Clean up
        cleaned = re.sub(r'[._-]', ' ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        return cleaned if cleaned else None
    
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
        """Parse title and year from folder name"""
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
    
    def get_series_by_id(self, series_id: str) -> Optional[Series]:
        """Get a specific series by ID"""
        all_series = self.scan_series()
        for series in all_series:
            if series.id == series_id:
                return series
        return None
    
    def get_episode_by_id(self, episode_id: str) -> Optional[Episode]:
        """Get a specific episode by ID"""
        all_series = self.scan_series()
        for series in all_series:
            for season in series.seasons:
                for episode in season.episodes:
                    if episode.id == episode_id:
                        return episode
        return None
    
    def search_series(self, query: str) -> List[Series]:
        """Search series by title"""
        all_series = self.scan_series()
        query_lower = query.lower()
        
        return [
            series for series in all_series
            if query_lower in series.title.lower()
        ]

series_service = SeriesService()
