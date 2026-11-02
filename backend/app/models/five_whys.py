import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class FiveWhysStep(Base):
    __tablename__ = "five_whys_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    step_number = Column(Integer, nullable=False)  # 1 to 5
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    supporting_evidence = Column(Text, nullable=True)
    is_confirmed = Column(Boolean, default=False, nullable=False)
    evidence_status = Column(String(64), default="Hypothetical", nullable=False)  # "Confirmed", "Hypothetical", "Needs Verification"
    follow_up_needed = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="five_whys")
