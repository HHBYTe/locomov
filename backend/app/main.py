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
