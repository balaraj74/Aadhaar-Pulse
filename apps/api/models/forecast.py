"""Forecast data model"""
from sqlalchemy import Column, String, Integer, Float, Date, DateTime, Index
from models.base import Base, TimestampMixin


class Forecast(Base, TimestampMixin):
    """
    Forecasted values for enrolments and updates
    Stores predictions with confidence intervals
    """
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Forecast metadata
    generated_at = Column(DateTime, nullable=False, index=True)
    model_name = Column(String(50), nullable=False)  # prophet, arima, etc.
    model_version = Column(String(20), nullable=False)
    
    # Target period
    forecast_date = Column(Date, nullable=False, index=True)
    horizon_months = Column(Integer, nullable=False)  # 1-12 months ahead
    
    # Geographic scope
    level = Column(String(20), nullable=False)  # national, state, district
    state_code = Column(String(3), nullable=True, index=True)
    state_name = Column(String(100), nullable=True)
    district_code = Column(String(10), nullable=True)
    district_name = Column(String(100), nullable=True)
    
    # Forecast type
    metric_type = Column(String(50), nullable=False)  # enrolments, updates, update_rate
    
    # Predicted values
    predicted_value = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=False)  # 95% CI
    upper_bound = Column(Float, nullable=False)  # 95% CI
    
    # Model confidence
    confidence = Column(Float, nullable=False, default=0.5)
    mape = Column(Float, nullable=True)  # Mean Absolute Percentage Error
    
    # Trend components
    trend_component = Column(Float, nullable=True)
    seasonal_component = Column(Float, nullable=True)
    
    # Capacity signals
    is_capacity_warning = Column(Integer, default=0)
    capacity_utilization_forecast = Column(Float, nullable=True)  # 0-1
    
    __table_args__ = (
        Index('ix_forecasts_date_level', 'forecast_date', 'level'),
        Index('ix_forecasts_state_metric', 'state_code', 'metric_type'),
    )
    
    def __repr__(self):
        return f"<Forecast(date={self.forecast_date}, metric={self.metric_type}, value={self.predicted_value})>"
