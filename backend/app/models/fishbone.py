import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class FishboneFactor(Base):
    __tablename__ = "fishbone_factors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Categories: "Man", "Machine", "Method", "Material", "Measurement", "Environment"
    category = Column(String(64), nullable=False)
    factor_title = Column(String(255), nullable=False)
    factor_detail = Column(Text, nullable=True)
    evidence_link = Column(Text, nullable=True)
    # Status: "Potential", "Investigated", "Eliminated", "Key Factor"
    status = Column(String(64), default="Potential", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    investigation = relationship("Investigation", back_populates="fishbone_factors")
