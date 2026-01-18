"""
Overview Router
Dashboard overview and summary metrics
"""
from fastapi import APIRouter
from typing import Dict, Any
from services.analytics_service import analytics_service

router = APIRouter(prefix="/overview", tags=["Overview"])


@router.get("")
async def get_overview() -> Dict[str, Any]:
    """
    Get complete dashboard overview with computed metrics.
    
    Returns:
        - Summary statistics (total enrolments, updates, centres, states)
        - Trend data (YoY growth, daily averages)
        - Distribution data (urban/rural, gender)
        - Top performing states
        - Active alerts
        - Metadata about data source and freshness
    """
    return analytics_service.get_overview_metrics()


@router.get("/kpis")
async def get_kpis() -> Dict[str, Any]:
    """Get key performance indicators"""
    metrics = analytics_service.get_overview_metrics()
    return {
        "kpis": [
            {
                "id": "total_enrolments",
                "title": "Total Enrolments",
                "value": metrics["summary"]["total_enrolments"],
                "change": metrics["trends"]["enrolment_growth_yoy"],
                "trend": "up" if metrics["trends"]["enrolment_growth_yoy"] > 0 else "down",
            },
            {
                "id": "total_updates",
                "title": "Total Updates",
                "value": metrics["summary"]["total_updates"],
                "change": metrics["trends"]["update_growth_yoy"],
                "trend": "up" if metrics["trends"]["update_growth_yoy"] > 0 else "down",
            },
            {
                "id": "active_centres",
                "title": "Active Centres",
                "value": metrics["summary"]["active_centres"],
                "change": 2.1,
                "trend": "up",
            },
            {
                "id": "states_covered",
                "title": "States/UTs",
                "value": metrics["summary"]["states_covered"],
            },
        ],
    }


@router.get("/summary")
async def get_summary() -> Dict[str, Any]:
    """Get summary statistics"""
    metrics = analytics_service.get_overview_metrics()
    return metrics["summary"]


@router.get("/trends")
async def get_trends() -> Dict[str, Any]:
    """Get trend metrics"""
    metrics = analytics_service.get_overview_metrics()
    return metrics["trends"]


@router.get("/alerts")
async def get_alerts() -> Dict[str, Any]:
    """Get active alerts"""
    metrics = analytics_service.get_overview_metrics()
    return {"alerts": metrics["alerts"]}
