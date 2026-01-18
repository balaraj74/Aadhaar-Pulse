"""
API Routers Package
"""
from routers.overview import router as overview_router
from routers.enrolments import router as enrolments_router
from routers.updates import router as updates_router
from routers.anomalies import router as anomalies_router
from routers.forecasts import router as forecasts_router
from routers.insights import router as insights_router
from routers.recommendations import router as recommendations_router
from routers.geography import router as geography_router
from routers.ai_analytics import router as ai_router

__all__ = [
    "overview_router",
    "enrolments_router",
    "updates_router",
    "anomalies_router",
    "forecasts_router",
    "insights_router",
    "recommendations_router",
    "geography_router",
    "ai_router",
]
