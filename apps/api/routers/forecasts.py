"""
Forecasts Router
Time series forecasting and capacity planning
"""
from fastapi import APIRouter, Query
from typing import Dict, Any
from services.forecast_engine import forecasting_engine

router = APIRouter(prefix="/forecasts", tags=["Forecasts"])


@router.get("")
async def get_forecasts(
    metric: str = Query(default="enrolments", description="Metric to forecast: enrolments or updates")
) -> Dict[str, Any]:
    """
    Get time series forecast for the specified metric.
    
    Returns:
        - Historical data
        - Forecast data with confidence intervals
        - Model accuracy metrics
    """
    return forecasting_engine.generate_forecast(metric=metric)


@router.get("/enrolments")
async def get_enrolment_forecast() -> Dict[str, Any]:
    """Get enrolment forecast specifically"""
    return forecasting_engine.generate_forecast(metric="enrolments")


@router.get("/updates")
async def get_update_forecast() -> Dict[str, Any]:
    """Get update forecast specifically"""
    return forecasting_engine.generate_forecast(metric="updates")


@router.get("/capacity")
async def get_capacity_forecast() -> Dict[str, Any]:
    """
    Get capacity planning forecast.
    
    Returns:
        - Current capacity analysis
        - Predicted demand
        - Regional breakdown
        - Recommendations
    """
    return forecasting_engine.get_capacity_forecast()


@router.get("/accuracy")
async def get_model_accuracy() -> Dict[str, Any]:
    """Get forecast model accuracy metrics"""
    forecast = forecasting_engine.generate_forecast(metric="enrolments")
    return {
        "model_info": forecast.get("model_info", {}),
        "accuracy_metrics": forecast.get("accuracy_metrics", {}),
    }
