"""Anomaly data model"""
from sqlalchemy import Column, String, Integer, Float, Date, DateTime, Text, Index
from models.base import Base, TimestampMixin


class Anomaly(Base, TimestampMixin):
    """
    Detected anomalies in Aadhaar data
    Stores flagged anomalies with explanations
    """
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Detection metadata
    detected_at = Column(DateTime, nullable=False, index=True)
    detection_method = Column(String(50), nullable=False)  # isolation_forest, zscore, iqr
    
    # Temporal context
    date = Column(Date, nullable=False, index=True)
    period_start = Column(Date, nullable=True)
    period_end = Column(Date, nullable=True)
    
    # Geographic context
    state_code = Column(String(3), nullable=False, index=True)
    state_name = Column(String(100), nullable=False)
    district_code = Column(String(10), nullable=True, index=True)
    district_name = Column(String(100), nullable=True)
    
    # Anomaly classification
    anomaly_type = Column(String(50), nullable=False, index=True)  # enrolment_spike, update_surge, etc.
    data_source = Column(String(50), nullable=False)  # enrolments, updates
    
    # Severity and scores
    severity = Column(String(20), nullable=False)  # low, medium, high, critical
    anomaly_score = Column(Float, nullable=False)  # 0-1 or z-score
    confidence = Column(Float, nullable=False, default=0.5)  # 0-1
    
    # Metrics that triggered the anomaly
    metric_name = Column(String(100), nullable=False)
    observed_value = Column(Float, nullable=False)
    expected_value = Column(Float, nullable=False)
    deviation_percent = Column(Float, nullable=False)
    
    # Context comparison
    state_average = Column(Float, nullable=True)
    national_average = Column(Float, nullable=True)
    historical_average = Column(Float, nullable=True)
    
    # Explanation
    explanation = Column(Text, nullable=False)
    possible_causes = Column(Text, nullable=True)  # JSON array of possible causes
    
    # Status
    is_acknowledged = Column(Integer, default=0)  # 0=new, 1=acknowledged, 2=resolved
    resolution_notes = Column(Text, nullable=True)
    
    __table_args__ = (
        Index('ix_anomalies_date_state', 'date', 'state_code'),
        Index('ix_anomalies_type_severity', 'anomaly_type', 'severity'),
    )
    
    def __repr__(self):
        return f"<Anomaly(date={self.date}, type={self.anomaly_type}, severity={self.severity})>"
