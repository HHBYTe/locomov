#!/bin/bash

# Movie Streaming Platform Setup Script
# This script creates the complete project structure with all necessary files

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Movie Streaming Platform Setup${NC}"
echo -e "${BLUE}================================================${NC}\n"

# Get project name
read -p "Enter project directory name (default: movie-streaming-platform): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-movie-streaming-platform}

# Check if directory exists
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}Warning: Directory '$PROJECT_NAME' already exists!${NC}"
    read -p "Do you want to continue and overwrite? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo -e "\n${GREEN}Creating project structure...${NC}"

# Create main project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create directory structure
mkdir -p frontend/src/{css,js/modules,js/utils,assets/images}
mkdir -p backend/app/{api/routes,models,services,utils,tests}
mkdir -p media/movies

echo -e "${GREEN}✓ Directory structure created${NC}"

# ============================================
# ROOT LEVEL FILES
# ============================================

echo -e "${GREEN}Creating root configuration files...${NC}"

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: movie_backend
    ports:
      - "8000:8000"
    volumes:
      - ./media:/app/media:ro
      - ./backend/app:/app/app
    environment:
      - MEDIA_PATH=/app/media/movies
      - CORS_ORIGINS=http://localhost,http://192.168.1.100
    restart: unless-stopped
    networks:
      - movie_network

  frontend:
    build: ./frontend
    container_name: movie_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - movie_network

networks:
  movie_network:
    driver: bridge
EOF

# .env.example
cat > .env.example << 'EOF'
# Backend Configuration
MEDIA_PATH=/app/media/movies
CORS_ORIGINS=http://localhost,http://your-server-ip

# Add your configuration here
EOF

# .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.egg-info/
.pytest_cache/

# Docker
*.log

# Media files
media/movies/*
!media/movies/.gitkeep

# Environment
.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

# README.md
cat > README.md << 'EOF'
# Movie Streaming Platform

A modular, Docker-based movie streaming platform with a Python backend and modern HTML/JS frontend.

## Features

- Alphabetically sorted movie list
- Search functionality
- Video streaming with HTML5 player
- Responsive design
- Docker containerization

## Quick Start

1. Place your movie files in `media/movies/`
2. Build and start containers:
   ```bash
   docker-compose up -d
   ```
3. Access the platform at `http://localhost`

## Development

### Prerequisites
- Docker & Docker Compose
- Your movie files in MP4 format

### Project Structure
```
├── frontend/          # HTML, CSS, JS
├── backend/           # Python FastAPI backend
├── media/movies/      # Your movie files
└── docker-compose.yml
```

### Stopping the Application
```bash
docker-compose down
```

## Configuration

Edit `docker-compose.yml` to change:
- Ports (default: 80 for frontend, 8000 for backend)
- CORS origins
- Volume mounts

## Movie File Naming

Name your files like: `Movie_Title_(Year).mp4`
Example: `The_Matrix_(1999).mp4`

## Logs

View logs with:
```bash
docker-compose logs -f
```

## License

MIT
EOF

echo -e "${GREEN}✓ Root files created${NC}"

# ============================================
# BACKEND FILES
# ============================================

echo -e "${GREEN}Creating backend files...${NC}"

# backend/Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for video processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# backend/requirements.txt
cat > backend/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
aiofiles==23.2.1
python-jose[cryptography]==3.3.0
EOF

# backend/app/__init__.py
touch backend/app/__init__.py

# backend/app/config.py
cat > backend/app/config.py << 'EOF'
import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Movie Streaming Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Media settings
    MEDIA_PATH: str = os.getenv("MEDIA_PATH", "/app/media/movies")
    SUPPORTED_FORMATS: List[str] = [".mp4", ".mkv", ".avi", ".mov", ".webm"]
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost").split(",")
    
    # Streaming
    CHUNK_SIZE: int = 1024 * 1024  # 1MB chunks

settings = Settings()
EOF

# backend/app/main.py
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import movies, stream

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router, prefix=f"{settings.API_PREFIX}/movies", tags=["movies"])
app.include_router(stream.router, prefix=f"{settings.API_PREFIX}/stream", tags=["stream"])

@app.get("/")
async def root():
    return {
        "message": "Movie Streaming Platform API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
EOF

# backend/app/models/__init__.py
touch backend/app/models/__init__.py

# backend/app/models/movie.py
cat > backend/app/models/movie.py << 'EOF'
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
EOF

# backend/app/services/__init__.py
touch backend/app/services/__init__.py

# backend/app/services/movie_service.py
cat > backend/app/services/movie_service.py << 'EOF'
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
EOF

# backend/app/services/streaming_service.py
cat > backend/app/services/streaming_service.py << 'EOF'
from pathlib import Path
from typing import AsyncIterator
from app.config import settings

class StreamingService:
    @staticmethod
    async def stream_file(file_path: str, start: int = 0, end: int = None) -> AsyncIterator[bytes]:
        """Stream video file in chunks"""
        path = Path(file_path)
        file_size = path.stat().st_size
        
        if end is None:
            end = file_size - 1
        
        with open(path, 'rb') as video:
            video.seek(start)
            remaining = end - start + 1
            
            while remaining > 0:
                chunk_size = min(settings.CHUNK_SIZE, remaining)
                data = video.read(chunk_size)
                if not data:
                    break
                remaining -= len(data)
                yield data

streaming_service = StreamingService()
EOF

# backend/app/api/__init__.py
touch backend/app/api/__init__.py

# backend/app/api/routes/__init__.py
touch backend/app/api/routes/__init__.py

# backend/app/api/routes/movies.py
cat > backend/app/api/routes/movies.py << 'EOF'
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
EOF

# backend/app/api/routes/stream.py
cat > backend/app/api/routes/stream.py << 'EOF'
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
EOF

# backend/app/utils/__init__.py
touch backend/app/utils/__init__.py

echo -e "${GREEN}✓ Backend files created${NC}"

# ============================================
# FRONTEND FILES
# ============================================

echo -e "${GREEN}Creating frontend files...${NC}"

# frontend/Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY src/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# frontend/nginx.conf
cat > frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Main application
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy to backend
        location /api {
            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            
            # Increase timeouts for video streaming
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }
    }
}
EOF

# frontend/src/index.html
cat > frontend/src/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Streaming Platform</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/movies.css">
    <link rel="stylesheet" href="css/player.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="logo">🎬 Movie Streaming</h1>
            <div class="search-container">
                <input 
                    type="text" 
                    id="searchInput" 
                    class="search-input" 
                    placeholder="Search movies..."
                >
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <!-- Player Section (hidden by default) -->
            <section id="playerSection" class="player-section" style="display: none;">
                <button id="backButton" class="back-button">← Back to Movies</button>
                <div class="player-container">
                    <video id="videoPlayer" class="video-player" controls>
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="movie-info">
                    <h2 id="currentMovieTitle"></h2>
                    <p id="currentMovieYear"></p>
                </div>
            </section>

            <!-- Movies List Section -->
            <section id="moviesSection" class="movies-section">
                <div class="section-header">
                    <h2 id="sectionTitle">All Movies</h2>
                    <span id="movieCount" class="movie-count"></span>
                </div>
                
                <div id="loadingSpinner" class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading movies...</p>
                </div>

                <div id="errorMessage" class="error-message" style="display: none;">
                    <p>Failed to load movies. Please try again.</p>
                </div>

                <div id="moviesList" class="movies-grid"></div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Movie Streaming Platform. All rights reserved.</p>
        </div>
    </footer>

    <script type="module" src="js/app.js"></script>
</body>
</html>
EOF

# frontend/src/css/main.css
cat > frontend/src/css/main.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #e50914;
    --secondary-color: #141414;
    --text-color: #ffffff;
    --text-secondary: #b3b3b3;
    --background: #000000;
    --card-background: #1a1a1a;
    --hover-color: #2a2a2a;
    --border-radius: 8px;
    --transition: all 0.3s ease;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: var(--background);
    color: var(--text-color);
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
}

/* Header */
.header {
    background-color: var(--secondary-color);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary-color);
    white-space: nowrap;
}

/* Search */
.search-container {
    flex: 1;
    max-width: 500px;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    color: var(--text-color);
    font-size: 1rem;
    transition: var(--transition);
}

.search-input:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.15);
    border-color: var(--primary-color);
}

.search-input::placeholder {
    color: var(--text-secondary);
}

/* Main Content */
.main {
    flex: 1;
    padding: 2rem 0;
}

/* Section Header */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.section-header h2 {
    font-size: 2rem;
}

.movie-count {
    color: var(--text-secondary);
    font-size: 1rem;
}

/* Loading Spinner */
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
    text-align: center;
    padding: 3rem;
    color: var(--primary-color);
}

/* Footer */
.footer {
    background-color: var(--secondary-color);
    padding: 2rem 0;
    margin-top: auto;
    text-align: center;
    color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .search-container {
        max-width: 100%;
    }
    
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
EOF

# frontend/src/css/movies.css
cat > frontend/src/css/movies.css << 'EOF'
.movies-section {
    min-height: 400px;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

.movie-card {
    background-color: var(--card-background);
    border-radius: var(--border-radius);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
}

.movie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.movie-card:hover .movie-overlay {
    opacity: 1;
}

.movie-thumbnail {
    width: 100%;
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, var(--secondary-color) 0%, var(--card-background) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    position: relative;
}

.movie-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(229, 9, 20, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
}

.play-icon {
    font-size: 4rem;
}

.movie-details {
    padding: 1.5rem;
}

.movie-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.movie-year {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.movie-meta {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 1200px) {
    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
    }
    
    .movie-details {
        padding: 1rem;
    }
    
    .movie-title {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
}
EOF

# frontend/src/css/player.css
cat > frontend/src/css/player.css << 'EOF'
.player-section {
    margin-bottom: 2rem;
}

.back-button {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--text-color);
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    transition: var(--transition);
    margin-bottom: 1.5rem;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.player-container {
    background-color: #000;
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
}

.video-player {
    width: 100%;
    max-height: 70vh;
    display: block;
}

.movie-info {
    padding: 1rem 0;
}

.movie-info h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.movie-info p {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

/* Video controls styling (browser default) */
video::-webkit-media-controls-panel {
    background-color: rgba(20, 20, 20, 0.95);
}

video::-webkit-media-controls-play-button,
video::-webkit-media-controls-volume-slider {
    filter: brightness(1.2);
}

/* Responsive */
@media (max-width: 768px) {
    .video-player {
        max-height: 50vh;
    }
    
    .movie-info h2 {
        font-size: 1.5rem;
    }
}
EOF

# frontend/src/js/app.js
cat > frontend/src/js/app.js << 'EOF'
import { API } from './modules/api.js';
import { MovieList } from './modules/movieList.js';
import { Search } from './modules/search.js';
import { Player } from './modules/player.js';

class App {
    constructor() {
        this.api = new API();
        this.movieList = new MovieList(this.api);
        this.search = new Search(this.api);
        this.player = new Player(this.api);
        
        this.init();
    }
    
    init() {
        // Load all movies on startup
        this.movieList.loadMovies();
        
        // Setup search
        this.search.onSearch((query) => {
            if (query.trim()) {
                this.movieList.searchMovies(query);
            } else {
                this.movieList.loadMovies();
            }
        });
        
        // Setup movie selection
        this.movieList.onMovieSelect((movie) => {
            this.player.playMovie(movie);
        });
        
        // Setup back button
        this.player.onBack(() => {
            this.movieList.show();
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
EOF

# frontend/src/js/modules/api.js
cat > frontend/src/js/modules/api.js << 'EOF'
export class API {
    constructor() {
        this.baseURL = '/api';
    }
    
    async getMovies() {
        try {
            const response = await fetch(`${this.baseURL}/movies/`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    }
    
    async searchMovies(query) {
        try {
            const response = await fetch(`${this.baseURL}/movies/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search movies');
            return await response.json();
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }
    
    getStreamURL(movieId) {
        return `${this.baseURL}/stream/${movieId}`;
    }
}
EOF

# frontend/src/js/modules/movieList.js
cat > frontend/src/js/modules/movieList.js << 'EOF'
import { createElement } from '../utils/dom.js';

export class MovieList {
    constructor(api) {
        this.api = api;
        this.container = document.getElementById('moviesList');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.sectionTitle = document.getElementById('sectionTitle');
        this.movieCount = document.getElementById('movieCount');
        this.moviesSection = document.getElementById('moviesSection');
        
        this.onMovieSelectCallback = null;
    }
    
    async loadMovies() {
        this.showLoading();
        this.sectionTitle.textContent = 'All Movies';
        
        try {
            const data = await this.api.getMovies();
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    async searchMovies(query) {
        this.showLoading();
        this.sectionTitle.textContent = `Search Results for "${query}"`;
        
        try {
            const data = await this.api.searchMovies(query);
            this.renderMovies(data.movies, data.total);
        } catch (error) {
            this.showError();
        }
    }
    
    renderMovies(movies, total) {
        this.hideLoading();
        this.hideError();
        this.container.innerHTML = '';
        
        this.movieCount.textContent = `${total} movie${total !== 1 ? 's' : ''}`;
        
        if (movies.length === 0) {
            this.showEmptyState();
            return;
        }
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            this.container.appendChild(card);
        });
    }
    
    createMovieCard(movie) {
        const card = createElement('div', { className: 'movie-card' });
        
        card.innerHTML = `
            <div class="movie-thumbnail">
                🎬
                <div class="movie-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="movie-details">
                <h3 class="movie-title">${this.escapeHtml(movie.title)}</h3>
                ${movie.year ? `<p class="movie-year">${movie.year}</p>` : ''}
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (this.onMovieSelectCallback) {
                this.onMovieSelectCallback(movie);
            }
        });
        
        return card;
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No movies found</h3>
                <p>Try a different search term</p>
            </div>
        `;
    }
    
    showLoading() {
        this.loadingSpinner.style.display = 'flex';
        this.container.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
        this.container.style.display = 'grid';
    }
    
    showError() {
        this.loadingSpinner.style.display = 'none';
        this.container.style.display = 'none';
        this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    show() {
        this.moviesSection.style.display = 'block';
    }
    
    hide() {
        this.moviesSection.style.display = 'none';
    }
    
    onMovieSelect(callback) {
        this.onMovieSelectCallback = callback;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
EOF

# frontend/src/js/modules/search.js
cat > frontend/src/js/modules/search.js << 'EOF'
export class Search {
    constructor(api) {
        this.api = api;
        this.searchInput = document.getElementById('searchInput');
        this.debounceTimer = null;
        this.onSearchCallback = null;
        
        this.init();
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });
    }
    
    debounceSearch(query) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            if (this.onSearchCallback) {
                this.onSearchCallback(query);
            }
        }, 300);
    }
    
    onSearch(callback) {
        this.onSearchCallback = callback;
    }
}
EOF

# frontend/src/js/modules/player.js
cat > frontend/src/js/modules/player.js << 'EOF'
export class Player {
    constructor(api) {
        this.api = api;
        this.playerSection = document.getElementById('playerSection');
        this.moviesSection = document.getElementById('moviesSection');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.backButton = document.getElementById('backButton');
        this.currentMovieTitle = document.getElementById('currentMovieTitle');
        this.currentMovieYear = document.getElementById('currentMovieYear');
        
        this.onBackCallback = null;
        
        this.init();
    }
    
    init() {
        this.backButton.addEventListener('click', () => {
            this.stop();
            if (this.onBackCallback) {
                this.onBackCallback();
            }
        });
    }
    
    playMovie(movie) {
        // Hide movies section
        this.moviesSection.style.display = 'none';
        
        // Show player section
        this.playerSection.style.display = 'block';
        
        // Update movie info
        this.currentMovieTitle.textContent = movie.title;
        this.currentMovieYear.textContent = movie.year || '';
        
        // Set video source
        const streamURL = this.api.getStreamURL(movie.id);
        this.videoPlayer.src = streamURL;
        
        // Play video
        this.videoPlayer.load();
        this.videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    stop() {
        this.videoPlayer.pause();
        this.videoPlayer.src = '';
        this.playerSection.style.display = 'none';
    }
    
    onBack(callback) {
        this.onBackCallback = callback;
    }
}
EOF

# frontend/src/js/utils/dom.js
cat > frontend/src/js/utils/dom.js << 'EOF'
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'dataset') {
            Object.keys(attributes[key]).forEach(dataKey => {
                element.dataset[dataKey] = attributes[key][dataKey];
            });
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
EOF

# frontend/src/js/utils/helpers.js
cat > frontend/src/js/utils/helpers.js << 'EOF'
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds) {
    if (!seconds) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

export function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
EOF

echo -e "${GREEN}✓ Frontend files created${NC}"

# ============================================
# MEDIA DIRECTORY
# ============================================

# Create .gitkeep for media/movies
touch media/movies/.gitkeep

# Create example file
cat > media/movies/README.txt << 'EOF'
Place your movie files here.

Supported formats: .mp4, .mkv, .avi, .mov, .webm

Recommended naming convention:
Movie_Title_(Year).mp4

Examples:
- The_Matrix_(1999).mp4
- Inception_(2010).mp4
- Interstellar_(2014).mp4
EOF

echo -e "${GREEN}✓ Media directory prepared${NC}"

# ============================================
# FINAL STEPS
# ============================================

echo -e "\n${BLUE}================================================${NC}"
echo -e "${GREEN}✓ Project setup complete!${NC}"
echo -e "${BLUE}================================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}\n"
echo -e "1. Navigate to your project:"
echo -e "   ${BLUE}cd $PROJECT_NAME${NC}\n"

echo -e "2. Add your movie files to:"
echo -e "   ${BLUE}media/movies/${NC}\n"

echo -e "3. Start the application:"
echo -e "   ${BLUE}docker-compose up -d${NC}\n"

echo -e "4. Access your platform at:"
echo -e "   ${BLUE}http://localhost${NC}\n"

echo -e "5. View logs:"
echo -e "   ${BLUE}docker-compose logs -f${NC}\n"

echo -e "6. Stop the application:"
echo -e "   ${BLUE}docker-compose down${NC}\n"

echo -e "${GREEN}Happy streaming! 🎬${NC}\n"
