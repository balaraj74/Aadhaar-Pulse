"""
Insights Router
AI-generated insights and pattern analysis
"""
from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from services.insight_engine import insight_engine

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("")
async def get_insights(
    category: Optional[str] = Query(default=None, description="Filter by category"),
    priority: Optional[str] = Query(default=None, description="Filter by priority: high, medium, low")
) -> Dict[str, Any]:
    """
    Get AI-generated insights from data analysis.
    
    Returns:
        - List of insights with evidence and implications
        - Category and priority statistics
    """
    insights = insight_engine.generate_all_insights()
    
    # Apply filters
    if category:
        insights = [i for i in insights if i["category"].lower() == category.lower()]
    if priority:
        insights = [i for i in insights if i["priority"] == priority]
    
    return {
        "insights": insights,
        "total_insights": len(insights),
    }


@router.get("/stats")
async def get_insight_stats() -> Dict[str, Any]:
    """Get insight generation statistics"""
    return insight_engine.get_insight_stats()


@router.get("/{insight_id}")
async def get_insight_detail(insight_id: str) -> Dict[str, Any]:
    """Get detailed information about a specific insight"""
    insights = insight_engine.generate_all_insights()
    insight = next((i for i in insights if i["id"] == insight_id), None)
    
    if not insight:
        return {"error": f"Insight {insight_id} not found"}
    
    return {"insight": insight}


@router.get("/categories")
async def get_categories() -> Dict[str, Any]:
    """Get available insight categories"""
    return {
        "categories": [
            "Migration",
            "Demographics",
            "Operations",
            "Seasonal",
            "Capacity",
            "Growth",
        ]
    }
