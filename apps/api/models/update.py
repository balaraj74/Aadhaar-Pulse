"""Update data model"""
from sqlalchemy import Column, String, Integer, Float, Date, Index, Enum
from models.base import Base, TimestampMixin
import enum


class UpdateType(str, enum.Enum):
    """Types of Aadhaar updates"""
    BIOMETRIC = "biometric"
    DEMOGRAPHIC = "demographic"
    MOBILE = "mobile"
    EMAIL = "email"
    ADDRESS = "address"
    NAME = "name"
    DOB = "dob"
    GENDER = "gender"
    PHOTO = "photo"
    IRIS = "iris"
    FINGERPRINT = "fingerprint"


class Update(Base, TimestampMixin):
    """
    Aadhaar Update data model
    Tracks update requests and patterns by type, location, and time
    """
    __tablename__ = "updates"
    
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
    
    # Update type breakdown
    update_type = Column(String(50), nullable=False, index=True)
    total_updates = Column(Integer, nullable=False, default=0)
    
    # Online vs Offline
    online_updates = Column(Integer, default=0)
    offline_updates = Column(Integer, default=0)
    
    # Demographics
    male_count = Column(Integer, default=0)
    female_count = Column(Integer, default=0)
    
    age_0_18 = Column(Integer, default=0)
    age_18_40 = Column(Integer, default=0)
    age_40_60 = Column(Integer, default=0)
    age_60_plus = Column(Integer, default=0)
    
    # Repeat updates (same user multiple updates)
    first_time_updates = Column(Integer, default=0)
    repeat_updates = Column(Integer, default=0)
    
    # Update frequency metrics
    average_update_interval_days = Column(Float, nullable=True)  # for repeat updates
    
    # Derived metrics
    update_rate = Column(Float, nullable=True)  # updates per 1000 enrolled
    growth_rate = Column(Float, nullable=True)  # month-over-month
    fatigue_index = Column(Float, nullable=True)  # high repeat rate indicator
    
    __table_args__ = (
        Index('ix_updates_date_state', 'date', 'state_code'),
        Index('ix_updates_type_date', 'update_type', 'date'),
        Index('ix_updates_year_month', 'year', 'month'),
    )
    
    def __repr__(self):
        return f"<Update(date={self.date}, type={self.update_type}, total={self.total_updates})>"
