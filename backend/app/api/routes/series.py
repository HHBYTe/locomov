from fastapi import APIRouter, Query
from app.models.movie import SeriesList
from app.services.series_service import series_service

router = APIRouter()

@router.get("/", response_model=SeriesList)
async def get_series():
    """Get all series"""
    series = series_service.scan_series()
    return SeriesList(series=series, total=len(series))

@router.get("/search", response_model=SeriesList)
async def search_series(q: str = Query(..., min_length=1)):
    """Search series by title"""
    series = series_service.search_series(q)
    return SeriesList(series=series, total=len(series))

@router.get("/{series_id}")
async def get_series_detail(series_id: str):
    """Get a specific series by ID"""
    series = series_service.get_series_by_id(series_id)
    if not series:
        return {"error": "Series not found"}, 404
    return series
