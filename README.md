# Movie & Series Streaming Platform

A modular, Docker-based streaming platform supporting both movies and TV series with subtitle support.

## Features

- 🎬 Movies and 📺 Series support
- 📄 Subtitle support (SRT, VTT, ASS, SSA)
- 🔍 Search functionality
- 🎯 Season and episode organization
- 🐳 Docker containerization

## Media Folder Structure

### Movies
Each movie should be in its own folder with the video file and optional subtitles:

```
media/movies/
├── The_Matrix_(1999)/
│   ├── The_Matrix_(1999).mp4
│   ├── The_Matrix_(1999).en.srt
│   └── The_Matrix_(1999).es.srt
├── Inception_(2010)/
│   ├── Inception_(2010).mkv
│   └── Inception_(2010).en.srt
└── Interstellar_(2014)/
    └── Interstellar_(2014).mp4
```

### Series
Each series should be in its own folder with season folders containing episodes:

```
media/series/
├── Breaking_Bad_(2008)/
│   ├── Season 1/
│   │   ├── S01E01.mp4
│   │   ├── S01E01.en.srt
│   │   ├── S01E02.mp4
│   │   └── S01E02.en.srt
│   └── Season 2/
│       ├── S02E01.mp4
│       └── S02E02.mp4
└── The_Office_(2005)/
    ├── S01/
    │   ├── Episode_01.mkv
    │   └── Episode_02.mkv
    └── S02/
        └── Episode_01.mkv
```

**Note:** Season folders can be named as:
- `Season 1`, `Season 2`, etc.
- `S01`, `S02`, etc.
- `1`, `2`, etc.

## Supported Formats

**Video:** MP4, MKV, AVI, MOV, WEBM  
**Subtitles:** SRT, VTT, ASS, SSA

## File Naming Conventions

### Movies
- Folder name: `Movie_Title_(Year)` (year optional)
- Video file: Any supported format
- Subtitles: `filename.LANG.srt` (e.g., `movie.en.srt`, `movie.es.srt`)

### Series
- Series folder: `Series_Name_(Year)` (year optional)
- Episodes: Should contain `E##` or `Episode ##` in filename
- Subtitles: Match episode filename pattern

## Configuration

Edit `docker-compose.yml` to change:
- Ports (default: 80 for frontend, 8000 for backend)
- CORS origins
- Volume mounts

## Development

### Project Structure
```
├── frontend/          # HTML, CSS, JS
├── backend/           # Python FastAPI backend
├── media/
│   ├── movies/       # Movie folders
│   └── series/       # Series folders
└── docker-compose.yml
```

### View Logs
```bash
docker-compose logs -f
```
