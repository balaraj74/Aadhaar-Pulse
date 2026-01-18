"""
AI Analytics Router
Gemini-powered advanced analysis endpoints
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
from services.gemini_service import gemini_service
from services.analytics_service import analytics_service
from services.anomaly_engine import anomaly_engine
from services.forecast_engine import forecasting_engine
from services.data_repository import aadhaar_repository

router = APIRouter(prefix="/ai", tags=["AI Analytics"])


class ChatRequest(BaseModel):
    question: str


class AnalysisRequest(BaseModel):
    data: Dict[str, Any]
    analysis_type: str = "general"


@router.get("/status")
async def get_ai_status() -> Dict[str, Any]:
    """Check AI service status"""
    return {
        "gemini_available": gemini_service.is_available(),
        "model": "gemini-2.5-flash-preview-05-20",
        "capabilities": [
            "executive_summary",
            "anomaly_explanation",
            "smart_insights",
            "data_chat",
            "forecast_analysis",
            "recommendation_generation",
        ],
    }


@router.get("/executive-summary")
async def get_executive_summary() -> Dict[str, Any]:
    """
    Get an AI-generated executive summary of today's dashboard data.
    Uses Gemini 2.5 Flash to analyze all key metrics and provide
    actionable insights for leadership.
    """
    # Gather all relevant data
    overview = analytics_service.get_overview_metrics()
    anomalies = anomaly_engine.detect_all_anomalies()
    forecast = forecasting_engine.generate_forecast("enrolments")
    
    # Generate AI summary
    summary = gemini_service.generate_executive_summary(
        overview_data=overview,
        anomalies=anomalies,
        forecasts=forecast
    )
    
    return summary


@router.get("/analyze/overview")
async def analyze_overview() -> Dict[str, Any]:
    """AI analysis of dashboard overview data"""
    overview = analytics_service.get_overview_metrics()
    return gemini_service.analyze_data_sync(overview, "overview")


@router.get("/analyze/anomalies")
async def analyze_anomalies() -> Dict[str, Any]:
    """AI analysis and explanation of detected anomalies"""
    anomalies = anomaly_engine.detect_all_anomalies()
    return gemini_service.analyze_data_sync({"anomalies": anomalies}, "anomaly")


@router.get("/analyze/forecast")
async def analyze_forecast() -> Dict[str, Any]:
    """AI analysis of forecast data with strategic recommendations"""
    forecast = forecasting_engine.generate_forecast("enrolments")
    capacity = forecasting_engine.get_capacity_forecast()
    return gemini_service.analyze_data_sync(
        {"forecast": forecast, "capacity": capacity}, 
        "forecast"
    )


@router.get("/analyze/geography")
async def analyze_geography() -> Dict[str, Any]:
    """AI analysis of geographic distribution"""
    geo_data = analytics_service.get_geography_data()
    return gemini_service.analyze_data_sync(geo_data, "geographic")


@router.get("/analyze/demographics")
async def analyze_demographics() -> Dict[str, Any]:
    """AI analysis of demographic patterns"""
    demo_data = aadhaar_repository.get_demographics()
    return gemini_service.analyze_data_sync(demo_data, "demographic")


@router.get("/explain/anomaly/{anomaly_id}")
async def explain_anomaly(anomaly_id: str) -> Dict[str, Any]:
    """Get AI-powered explanation for a specific anomaly"""
    anomalies = anomaly_engine.detect_all_anomalies()
    anomaly = next((a for a in anomalies if a["id"] == anomaly_id), None)
    
    if not anomaly:
        raise HTTPException(status_code=404, detail=f"Anomaly {anomaly_id} not found")
    
    return gemini_service.explain_anomaly(anomaly)


@router.get("/insight/smart")
async def get_smart_insight(
    context: str = Query(default="daily_review", description="Context for insight generation")
) -> Dict[str, Any]:
    """Get an AI-generated smart insight based on current data"""
    # Gather relevant data based on context
    overview = analytics_service.get_overview_metrics()
    
    data = {
        "summary": overview["summary"],
        "trends": overview["trends"],
        "top_states": overview["top_performing_states"][:5],
        "alerts": overview["alerts"],
    }
    
    return gemini_service.generate_smart_insight(data, context)


@router.post("/chat")
async def chat_with_data(request: ChatRequest) -> Dict[str, Any]:
    """
    Ask natural language questions about Aadhaar data.
    The AI will answer based on the current dashboard data.
    """
    # Build data context
    overview = analytics_service.get_overview_metrics()
    states = aadhaar_repository.get_state_data()[:10]
    demographics = aadhaar_repository.get_demographics()
    
    context = {
        "overview": overview["summary"],
        "trends": overview["trends"],
        "top_states": states,
        "demographics": demographics,
        "data_source": aadhaar_repository.get_api_metadata(),
    }
    
    return gemini_service.chat_with_data(request.question, context)


@router.get("/recommendations/smart")
async def get_smart_recommendations() -> Dict[str, Any]:
    """Get AI-powered policy recommendations"""
    # Gather comprehensive data
    overview = analytics_service.get_overview_metrics()
    update_analytics = analytics_service.get_update_analytics()
    states = aadhaar_repository.get_state_data()
    anomalies = anomaly_engine.detect_all_anomalies()
    
    data = {
        "overview": overview,
        "update_patterns": update_analytics["update_fatigue_index"],
        "states": states[:15],
        "active_anomalies": anomalies[:5],
    }
    
    return gemini_service.analyze_data_sync(data, "recommendation")


@router.get("/report/daily")
async def generate_daily_report() -> Dict[str, Any]:
    """Generate a comprehensive AI daily report"""
    if not gemini_service.is_available():
        return {"error": "AI service unavailable", "ai_powered": False}
    
    # Gather all data
    overview = analytics_service.get_overview_metrics()
    anomalies = anomaly_engine.detect_all_anomalies()
    forecast = forecasting_engine.generate_forecast("enrolments")
    geo = analytics_service.get_geography_data()
    
    # Generate executive summary
    exec_summary = gemini_service.generate_executive_summary(overview, anomalies, forecast)
    
    # Analyze overview
    overview_analysis = gemini_service.analyze_data_sync(overview, "overview")
    
    # Analyze anomalies
    anomaly_analysis = gemini_service.analyze_data_sync({"anomalies": anomalies[:5]}, "anomaly")
    
    return {
        "report_date": overview["metadata"]["computed_at"],
        "executive_summary": exec_summary.get("executive_summary", ""),
        "overview_analysis": overview_analysis.get("analysis", ""),
        "anomaly_analysis": anomaly_analysis.get("analysis", ""),
        "ai_powered": True,
        "model": "gemini-2.5-flash-preview-05-20",
    }
