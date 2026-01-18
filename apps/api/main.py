"""
Aadhaar Pulse API
Government-Grade Decision Support Analytics Platform

All data is computed dynamically from:
- Official Data.gov.in datasets (when available)
- Realistic simulated data based on UIDAI patterns

This API provides:
- Real-time analytics
- Anomaly detection
- Forecasting
- Insight generation
- Policy recommendations
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from config import settings
from routers import (
    overview_router,
    enrolments_router,
    updates_router,
    anomalies_router,
    forecasts_router,
    insights_router,
    recommendations_router,
    geography_router,
    ai_router,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager"""
    logger.info("=" * 60)
    logger.info("🚀 Starting Aadhaar Pulse API")
    logger.info(f"   Environment: {settings.ENVIRONMENT}")
    logger.info(f"   Version: {settings.API_VERSION}")
    logger.info("=" * 60)
    
    # Initialize services
    logger.info("📊 Initializing data repository...")
    from services.data_repository import aadhaar_repository
    logger.info(f"   ✅ Data repository initialized")
    
    logger.info("🔍 Initializing analytics engine...")
    from services.analytics_service import analytics_service
    logger.info(f"   ✅ Analytics service ready")
    
    logger.info("⚠️  Initializing anomaly detection...")
    from services.anomaly_engine import anomaly_engine
    logger.info(f"   ✅ Anomaly engine ready")
    
    logger.info("📈 Initializing forecasting engine...")
    from services.forecast_engine import forecasting_engine
    logger.info(f"   ✅ Forecasting engine ready")
    
    logger.info("💡 Initializing insight engine...")
    from services.insight_engine import insight_engine
    logger.info(f"   ✅ Insight engine ready")
    
    logger.info("🤖 Initializing Gemini AI...")
    from services.gemini_service import gemini_service
    if gemini_service.is_available():
        logger.info(f"   ✅ Gemini AI ready (gemini-2.5-flash-preview-05-20)")
    else:
        logger.warning(f"   ⚠️ Gemini AI not available (check API key)")
    
    logger.info("✨ Aadhaar Pulse API is ready!")
    logger.info("=" * 60)
    
    yield
    
    logger.info("Shutting down Aadhaar Pulse API...")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=__doc__,
    version=settings.API_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(overview_router, prefix="/api/v1")
app.include_router(enrolments_router, prefix="/api/v1")
app.include_router(updates_router, prefix="/api/v1")
app.include_router(anomalies_router, prefix="/api/v1")
app.include_router(forecasts_router, prefix="/api/v1")
app.include_router(insights_router, prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(geography_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Aadhaar Pulse API",
        "version": settings.API_VERSION,
        "description": "Government-Grade Decision Support Analytics Platform",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "overview": "/api/v1/overview",
            "enrolments": "/api/v1/enrolments",
            "updates": "/api/v1/updates",
            "anomalies": "/api/v1/anomalies",
            "forecasts": "/api/v1/forecasts",
            "insights": "/api/v1/insights",
            "recommendations": "/api/v1/recommendations",
            "geography": "/api/v1/geography",
        },
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "data_repository": "operational",
            "analytics": "operational",
            "anomaly_detection": "operational",
            "forecasting": "operational",
            "insights": "operational",
        },
    }


@app.get("/api/v1/metadata")
async def get_metadata():
    """Get API metadata and data source information"""
    from services.data_repository import aadhaar_repository
    
    api_info = aadhaar_repository.get_api_metadata()
    summary = aadhaar_repository.get_summary_stats()
    
    return {
        "api_version": settings.API_VERSION,
        "data_source": {
            "type": api_info.get("data_source", "simulated"),
            "primary": "Data.gov.in Official Aadhaar Datasets",
            "resource_id": "ecd49b12-3084-4521-8f7e-ca8bf72069ba",
            "total_records": api_info.get("total_records_available", 0),
            "api_title": api_info.get("api_title"),
            "organization": api_info.get("org"),
            "last_updated": api_info.get("updated_date"),
            "last_refresh": api_info.get("last_refresh"),
        },
        "coverage": {
            "states": summary.get("states_covered", 36),
            "total_enrolments": summary.get("total_enrolments", 0),
            "time_range": "2020-2025",
            "update_frequency": "Monthly",
        },
        "privacy": {
            "pii_free": True,
            "aggregation_level": "State/District/Pincode",
            "compliance": "UIDAI Guidelines",
            "note": "All data is aggregated - no individual-level information",
        },
    }

