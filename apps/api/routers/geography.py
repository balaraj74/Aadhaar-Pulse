"""
Geography Router
Geographic analysis and state-wise data
"""
from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from services.analytics_service import analytics_service
from services.data_repository import aadhaar_repository

router = APIRouter(prefix="/geography", tags=["Geography"])


@router.get("")
async def get_geography() -> Dict[str, Any]:
    """
    Get comprehensive geographic analysis.
    
    Returns:
        - Heatmap data
        - State-wise breakdown
        - Regional aggregates
    """
    return analytics_service.get_geography_data()


@router.get("/heatmap")
async def get_heatmap() -> Dict[str, Any]:
    """Get heatmap data for visualization"""
    geo_data = analytics_service.get_geography_data()
    return geo_data["heatmap"]


@router.get("/states")
async def get_states(
    region: Optional[str] = Query(default=None, description="Filter by region")
) -> Dict[str, Any]:
    """Get state-wise data"""
    geo_data = analytics_service.get_geography_data()
    states = geo_data["states"]
    
    if region:
        states = [s for s in states if s["region"].lower() == region.lower()]
    
    return {
        "states": states,
        "total": len(states),
    }


@router.get("/regions")
async def get_regions() -> Dict[str, Any]:
    """Get regional aggregates"""
    geo_data = analytics_service.get_geography_data()
    return {
        "regions": geo_data["by_region"],
    }


@router.get("/state/{state_code}")
async def get_state_detail(state_code: str) -> Dict[str, Any]:
    """Get detailed data for a specific state"""
    states = aadhaar_repository.get_state_data()
    state = next((s for s in states if s["code"].upper() == state_code.upper()), None)
    
    if not state:
        return {"error": f"State {state_code} not found"}
    
    return {
        "state": {
            "name": state["name"],
            "code": state["code"],
            "region": state["region"],
            "total_enrolments": state["total_enrolments"],
            "monthly_enrolments": state["monthly_enrolments"],
            "yoy_growth": state["yoy_growth"],
            "urban_pct": round(state["urban_pct"] * 100, 1),
            "update_rate": round(state["update_rate"] * 100, 2),
        },
    }


@router.get("/districts/{state_code}")
async def get_districts(state_code: str) -> Dict[str, Any]:
    """Get district-wise data for a state (simulated)"""
    states = aadhaar_repository.get_state_data()
    state = next((s for s in states if s["code"].upper() == state_code.upper()), None)
    
    if not state:
        return {"error": f"State {state_code} not found"}
    
    # Generate sample district data
    import numpy as np
    num_districts = np.random.randint(10, 40)
    
    districts = []
    for i in range(num_districts):
        pct = np.random.uniform(0.01, 0.08)
        districts.append({
            "name": f"{state['name']} District {i + 1}",
            "enrolments": int(state["total_enrolments"] * pct),
            "growth": round(state["yoy_growth"] + np.random.uniform(-5, 5), 1),
        })
    
    return {
        "state": state["name"],
        "districts": sorted(districts, key=lambda x: x["enrolments"], reverse=True),
    }
