import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class ReviewEvent(Base):
    __tablename__ = "review_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    event_type = Column(String(64), nullable=False)  # "CREATED", "AI_EXTRACTED", "CAUSE_CONFIRMED", "CAPA_UPDATED", "REVIEWED", "SAVED"
    actor = Column(String(128), default="Quality Investigator", nullable=False)
    change_summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="review_events")
