"""Enrolment data model"""
from sqlalchemy import Column, String, Integer, Float, Date, Boolean, Index
from models.base import Base, TimestampMixin


class Enrolment(Base, TimestampMixin):
    """
    Aadhaar Enrolment data model
    Stores aggregated enrolment statistics by date, state, and district
    """
    __tablename__ = "enrolments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Temporal
    date = Column(Date, nullable=False, index=True)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)
    
    # Geographic
    state_code = Column(String(3), nullable=False, index=True)
    state_name = Column(String(100), nullable=False)
    district_code = Column(String(10), nullable=True, index=True)
    district_name = Column(String(100), nullable=True)
    region = Column(String(50), nullable=True)  # North, South, East, West, Central, NE
    
    # Enrolment counts
    total_enrolments = Column(Integer, nullable=False, default=0)
    new_enrolments = Column(Integer, nullable=False, default=0)
    
    # Demographics
    male_count = Column(Integer, default=0)
    female_count = Column(Integer, default=0)
    other_gender_count = Column(Integer, default=0)
    
    age_0_5 = Column(Integer, default=0)
    age_5_18 = Column(Integer, default=0)
    age_18_40 = Column(Integer, default=0)
    age_40_60 = Column(Integer, default=0)
    age_60_plus = Column(Integer, default=0)
    
    # Urban/Rural
    urban_count = Column(Integer, default=0)
    rural_count = Column(Integer, default=0)
    
    # Operational metrics
    registrar_count = Column(Integer, default=0)
    enrolment_agency_count = Column(Integer, default=0)
    average_processing_time = Column(Float, default=0)  # in minutes
    
    # Derived metrics (computed by analytics engine)
    growth_rate = Column(Float, nullable=True)  # month-over-month
    per_capita_rate = Column(Float, nullable=True)  # per 1000 population
    saturation_index = Column(Float, nullable=True)  # 0-1 scale
    
    # Flags
    is_metro = Column(Boolean, default=False)
    is_border_district = Column(Boolean, default=False)
    
    __table_args__ = (
        Index('ix_enrolments_date_state', 'date', 'state_code'),
        Index('ix_enrolments_date_district', 'date', 'district_code'),
        Index('ix_enrolments_year_month', 'year', 'month'),
    )
    
    def __repr__(self):
        return f"<Enrolment(date={self.date}, state={self.state_name}, total={self.total_enrolments})>"
