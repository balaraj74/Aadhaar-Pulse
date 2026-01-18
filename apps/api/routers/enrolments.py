"""
Enrolments Router
Enrolment analytics and time series data
"""
from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from services.analytics_service import analytics_service
from services.data_repository import aadhaar_repository

router = APIRouter(prefix="/enrolments", tags=["Enrolments"])


@router.get("")
async def get_enrolments(
    months: int = Query(default=24, ge=6, le=60, description="Number of months of data")
) -> Dict[str, Any]:
    """
    Get comprehensive enrolment analytics.
    
    Returns:
        - Time series data
        - Summary statistics
        - State-wise breakdown
        - Demographic distribution
    """
    return analytics_service.get_enrolment_analytics()


@router.get("/timeseries")
async def get_timeseries(
    months: int = Query(default=24, ge=6, le=60)
) -> Dict[str, Any]:
    """Get enrolment time series data"""
    data = aadhaar_repository.get_enrolment_timeseries(months=months)
    return {
        "series": data,
        "count": len(data),
        "period": f"Last {months} months",
    }


@router.get("/states")
async def get_states() -> Dict[str, Any]:
    """Get state-wise enrolment data"""
    states = aadhaar_repository.get_state_data()
    return {
        "states": [
            {
                "name": s["name"],
                "code": s["code"],
                "enrolments": s["total_enrolments"],
                "monthly_enrolments": s["monthly_enrolments"],
                "growth": s["yoy_growth"],
                "region": s["region"],
            }
            for s in states
        ],
        "total_states": len(states),
    }


@router.get("/demographics")
async def get_demographics() -> Dict[str, Any]:
    """Get demographic distribution of enrolments"""
    analytics = analytics_service.get_enrolment_analytics()
    return analytics["demographics"]


@router.get("/state/{state_code}")
async def get_state_details(state_code: str) -> Dict[str, Any]:
    """Get detailed data for a specific state"""
    states = aadhaar_repository.get_state_data()
    state = next((s for s in states if s["code"].upper() == state_code.upper()), None)
    
    if not state:
        return {"error": f"State {state_code} not found"}
    
    return {
        "state": state,
        "monthly_trend": aadhaar_repository.get_enrolment_timeseries(months=12),
    }
