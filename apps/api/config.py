"""
Aadhaar Pulse - Backend Configuration
Government-Grade Analytics Platform
"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API Settings
    API_TITLE: str = "Aadhaar Pulse API"
    API_VERSION: str = "2.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Data.gov.in API Configuration
    DATA_GOV_API_KEY: str = ""
    DATA_GOV_BASE_URL: str = "https://api.data.gov.in/resource"
    
    # Resource IDs for Aadhaar Datasets
    AADHAAR_ENROLMENT_RESOURCE_ID: str = "ecd49b12-3084-4521-8f7e-ca8bf72069ba"
    AADHAAR_GENDER_AGE_RESOURCE_ID: str = "d3ab1a98-3e49-4c5f-916b-0f4e2c0f9d5a"
    AADHAAR_DEMO_UPDATE_RESOURCE_ID: str = "f8b6c2d4-5a7e-4b9c-8d1f-2e3a4b5c6d7e"
    AADHAAR_BIO_UPDATE_RESOURCE_ID: str = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    
    # Database (for future PostgreSQL integration)
    DATABASE_URL: Optional[str] = None
    
    # Cache Settings
    CACHE_TTL_SECONDS: int = 300  # 5 minutes
    
    # Analytics Settings
    FORECAST_HORIZON_MONTHS: int = 6
    ANOMALY_ZSCORE_THRESHOLD: float = 2.5
    
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # CORS - Allow Vercel deployments
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://web-ashy-eight-32.vercel.app",
        "https://web-naggelsi8-balaraj74s-projects.vercel.app",
        "https://web-6z6zng1vn-balaraj74s-projects.vercel.app",
        "https://aadhaar-pulse.vercel.app",
        "https://aadhaar-pulse-web.vercel.app",
    ]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
