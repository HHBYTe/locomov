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
