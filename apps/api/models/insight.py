"""Insight data model"""
from sqlalchemy import Column, String, Integer, Float, Date, DateTime, Text, Index
from models.base import Base, TimestampMixin


class Insight(Base, TimestampMixin):
    """
    AI-generated insights and recommendations
    Stores actionable insights derived from analytics
    """
    __tablename__ = "insights"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Generation metadata
    generated_at = Column(DateTime, nullable=False, index=True)
    generation_method = Column(String(50), nullable=False)  # rule_based, statistical, ml
    
    # Temporal context
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    
    # Geographic context (optional)
    scope = Column(String(20), nullable=False)  # national, state, district
    state_code = Column(String(3), nullable=True, index=True)
    state_name = Column(String(100), nullable=True)
    district_code = Column(String(10), nullable=True)
    district_name = Column(String(100), nullable=True)
    
    # Insight classification
    category = Column(String(50), nullable=False, index=True)  # trend, anomaly, forecast, pattern
    subcategory = Column(String(50), nullable=True)  # migration, seasonal, demographic
    priority = Column(String(20), nullable=False)  # low, medium, high, critical
    
    # Insight content
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    detailed_explanation = Column(Text, nullable=True)
    
    # Supporting data
    metric_name = Column(String(100), nullable=True)
    metric_value = Column(Float, nullable=True)
    comparison_value = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    
    # Statistical backing
    statistical_significance = Column(Float, nullable=True)  # p-value
    confidence = Column(Float, nullable=False, default=0.5)
    
    # Recommendations
    recommendation = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)  # JSON array
    
    # Impact assessment
    impact_score = Column(Float, nullable=True)  # 0-10
    affected_population = Column(Integer, nullable=True)
    
    # Status
    is_active = Column(Integer, default=1)
    is_archived = Column(Integer, default=0)
    
    __table_args__ = (
        Index('ix_insights_category_priority', 'category', 'priority'),
        Index('ix_insights_scope_date', 'scope', 'period_start'),
    )
    
    def __repr__(self):
        return f"<Insight(category={self.category}, title={self.title[:30]}...)>"
