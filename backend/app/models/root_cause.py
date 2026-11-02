import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class RootCause(Base):
    __tablename__ = "root_causes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    cause_code = Column(String(32), nullable=False)  # e.g., "RC-01"
    category = Column(String(64), nullable=True)     # "Machine", "Method", "Material", etc.
    description = Column(Text, nullable=False)
    related_observation = Column(Text, nullable=True)
    
    supporting_evidence = Column(Text, nullable=True)
    contradicting_evidence = Column(Text, nullable=True)
    evidence_sufficiency = Column(String(64), default="Insufficient Evidence")  # "Sufficient", "Insufficient", "Inconclusive"
    
    # Statuses:
    # "Proposed", "Under Investigation", "Supported by Evidence", "Insufficient Evidence", "Contradicted", "Investigator Confirmed", "Rejected"
    status = Column(String(64), default="Proposed", nullable=False)
    
    # Human confirmation safeguards
    is_human_confirmed = Column(Boolean, default=False, nullable=False)
    confirmed_by = Column(String(128), nullable=True)
    confirmed_at = Column(DateTime, nullable=True)
    confirmation_notes = Column(Text, nullable=True)
    
    recommended_verification = Column(Text, nullable=True)
    model_confidence = Column(Float, nullable=True)  # Uncalibrated estimate 0.0 - 1.0
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="root_causes")
