import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class CapaAction(Base):
    __tablename__ = "capa_actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    action_code = Column(String(32), nullable=False)  # e.g., "CAPA-C-01", "CAPA-P-01"
    action_type = Column(String(32), nullable=False)  # "Corrective" or "Preventive"
    description = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    
    related_cause_id = Column(String(64), nullable=True)
    supporting_evidence = Column(Text, nullable=True)
    proposed_owner = Column(String(128), nullable=True)
    target_due_date = Column(String(64), nullable=True)
    
    # Status: "Proposed", "Accepted", "Rejected", "In Progress", "Completed", "Closed"
    status = Column(String(64), default="Proposed", nullable=False)
    effectiveness_check_plan = Column(Text, nullable=True)
    
    # Review decision: "Pending", "Accepted", "Rejected", "Modified"
    review_decision = Column(String(32), default="Pending", nullable=False)
    review_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="capa_actions")
