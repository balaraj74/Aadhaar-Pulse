"""
Updates Router
Update behavior analytics and patterns
"""
from fastapi import APIRouter, Query
from typing import Dict, Any
from services.analytics_service import analytics_service
from services.data_repository import aadhaar_repository

router = APIRouter(prefix="/updates", tags=["Updates"])


@router.get("")
async def get_updates() -> Dict[str, Any]:
    """
    Get comprehensive update analytics.
    
    Returns:
        - Update type distribution
        - Time series data
        - Seasonal patterns
        - Update fatigue metrics
    """
    return analytics_service.get_update_analytics()


@router.get("/types")
async def get_update_types() -> Dict[str, Any]:
    """Get update type distribution"""
    analytics = analytics_service.get_update_analytics()
    return {
        "update_types": analytics["update_types"],
        "most_common": analytics["summary"]["most_common_type"],
    }


@router.get("/timeseries")
async def get_timeseries(
    months: int = Query(default=24, ge=6, le=60)
) -> Dict[str, Any]:
    """Get update time series data"""
    data = aadhaar_repository.get_update_timeseries(months=months)
    return {
        "series": data,
        "count": len(data),
    }


@router.get("/patterns")
async def get_patterns() -> Dict[str, Any]:
    """Get update patterns and fatigue analysis"""
    analytics = analytics_service.get_update_analytics()
    return {
        "seasonal_patterns": analytics["seasonal_patterns"],
        "update_fatigue_index": analytics["update_fatigue_index"],
    }


@router.get("/fatigue")
async def get_update_fatigue() -> Dict[str, Any]:
    """Get update fatigue index and high-fatigue districts"""
    analytics = analytics_service.get_update_analytics()
    return analytics["update_fatigue_index"]
