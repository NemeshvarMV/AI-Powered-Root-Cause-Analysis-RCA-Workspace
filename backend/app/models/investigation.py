import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_number = Column(String(64), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    incident_description = Column(Text, nullable=False)
    
    # Pharmaceutical API Attributes
    product_name = Column(String(255), nullable=True)
    batch_number = Column(String(128), nullable=True)
    incident_date = Column(String(64), nullable=True)
    discovery_date = Column(String(64), nullable=True)
    process_stage = Column(String(128), nullable=True)
    
    # Deviation Specifics
    observed_deviation = Column(Text, nullable=True)
    expected_specification = Column(String(255), nullable=True)
    actual_result = Column(String(255), nullable=True)
    immediate_containment = Column(Text, nullable=True)
    equipment_id = Column(String(128), nullable=True)
    material_lot_id = Column(String(128), nullable=True)
    process_parameters = Column(JSON, nullable=True, default=dict)

    # Human Review & Lifecycle State
    # Lifecycle: Draft -> AI_Analyzed -> Under_Human_Review -> Reviewed -> Saved
    status = Column(String(64), default="Draft", nullable=False)
    reviewer_name = Column(String(128), nullable=True)
    reviewer_decision = Column(String(64), nullable=True)  # Approved, Rejected, Needs_Revision
    reviewer_comments = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    source_documents = relationship("SourceDocument", back_populates="investigation", cascade="all, delete-orphan")
    evidence_items = relationship("EvidenceItem", back_populates="investigation", cascade="all, delete-orphan")
    root_causes = relationship("RootCause", back_populates="investigation", cascade="all, delete-orphan")
    capa_actions = relationship("CapaAction", back_populates="investigation", cascade="all, delete-orphan")
    five_whys = relationship("FiveWhysStep", back_populates="investigation", cascade="all, delete-orphan", order_by="FiveWhysStep.step_number")
    fishbone_factors = relationship("FishboneFactor", back_populates="investigation", cascade="all, delete-orphan")
    review_events = relationship("ReviewEvent", back_populates="investigation", cascade="all, delete-orphan", order_by="desc(ReviewEvent.created_at)")
