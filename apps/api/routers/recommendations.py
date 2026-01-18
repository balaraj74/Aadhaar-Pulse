"""
Recommendations Router
Policy recommendations and action items
"""
from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from services.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("")
async def get_recommendations(
    category: Optional[str] = Query(default=None, description="Filter by category"),
    status: Optional[str] = Query(default=None, description="Filter by status: new, in_progress, implemented")
) -> Dict[str, Any]:
    """
    Get policy recommendations based on data analysis.
    
    Returns:
        - List of recommendations with impact analysis
        - Resource requirements
        - Status tracking
    """
    recommendations = recommendation_engine.generate_all_recommendations()
    
    # Apply filters
    if category:
        recommendations = [r for r in recommendations if r["category"].lower() == category.lower()]
    if status:
        recommendations = [r for r in recommendations if r["status"] == status]
    
    return {
        "recommendations": recommendations,
        "total_recommendations": len(recommendations),
    }


@router.get("/stats")
async def get_recommendation_stats() -> Dict[str, Any]:
    """Get recommendation statistics"""
    return recommendation_engine.get_recommendation_stats()


@router.get("/{recommendation_id}")
async def get_recommendation_detail(recommendation_id: str) -> Dict[str, Any]:
    """Get detailed information about a specific recommendation"""
    recommendations = recommendation_engine.generate_all_recommendations()
    rec = next((r for r in recommendations if r["id"] == recommendation_id), None)
    
    if not rec:
        return {"error": f"Recommendation {recommendation_id} not found"}
    
    return {"recommendation": rec}


@router.get("/categories")
async def get_categories() -> Dict[str, Any]:
    """Get available recommendation categories"""
    return {
        "categories": [
            "Infrastructure",
            "Policy",
            "Operations",
            "Technology",
            "Outreach",
        ]
    }


@router.get("/impact/{recommendation_id}")
async def get_impact_analysis(recommendation_id: str) -> Dict[str, Any]:
    """Get detailed impact analysis for a recommendation"""
    recommendations = recommendation_engine.generate_all_recommendations()
    rec = next((r for r in recommendations if r["id"] == recommendation_id), None)
    
    if not rec:
        return {"error": f"Recommendation {recommendation_id} not found"}
    
    return {
        "recommendation_id": recommendation_id,
        "title": rec["title"],
        "expected_impact": rec.get("expected_impact", {}),
        "resource_requirement": rec.get("resource_requirement", {}),
        "rationale": rec.get("rationale", []),
    }
