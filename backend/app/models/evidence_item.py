import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    item_description = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    related_cause_or_question = Column(String(255), nullable=True)
    recommended_next_step = Column(Text, nullable=True)
    evidence_type = Column(String(128), nullable=True)
    
    # Status: "Missing", "Requested", "Received", "Reviewed", "Inconclusive"
    status = Column(String(64), default="Missing", nullable=False)
    review_notes = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="evidence_items")
