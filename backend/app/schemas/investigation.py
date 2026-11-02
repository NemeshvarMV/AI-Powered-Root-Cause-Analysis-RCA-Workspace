from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

from backend.app.schemas.evidence import EvidenceItemResponse
from backend.app.schemas.rca import FiveWhysStepSchema, FishboneFactorSchema, RootCauseSchema
from backend.app.schemas.capa import CapaActionSchema


class InvestigationBase(BaseModel):
    title: str
    incident_number: Optional[str] = None
    incident_description: str
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    incident_date: Optional[str] = None
    discovery_date: Optional[str] = None
    process_stage: Optional[str] = None
    observed_deviation: Optional[str] = None
    expected_specification: Optional[str] = None
    actual_result: Optional[str] = None
    immediate_containment: Optional[str] = None
    equipment_id: Optional[str] = None
    material_lot_id: Optional[str] = None
    process_parameters: Dict[str, Any] = Field(default_factory=dict)
    status: str = "Draft"


class InvestigationCreate(InvestigationBase):
    # Optional initial children to save in one transactional operation
    source_type: Optional[str] = "text"
    raw_source_text: Optional[str] = None
    source_filename: Optional[str] = None
    evidence_items: Optional[List[dict]] = None
    root_causes: Optional[List[dict]] = None
    capa_actions: Optional[List[dict]] = None
    five_whys: Optional[List[dict]] = None
    fishbone_factors: Optional[List[dict]] = None


class InvestigationUpdate(BaseModel):
    title: Optional[str] = None
    incident_number: Optional[str] = None
    incident_description: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    incident_date: Optional[str] = None
    discovery_date: Optional[str] = None
    process_stage: Optional[str] = None
    observed_deviation: Optional[str] = None
    expected_specification: Optional[str] = None
    actual_result: Optional[str] = None
    immediate_containment: Optional[str] = None
    equipment_id: Optional[str] = None
    material_lot_id: Optional[str] = None
    process_parameters: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewer_decision: Optional[str] = None
    reviewer_comments: Optional[str] = None


class InvestigationReviewRequest(BaseModel):
    reviewer_name: str = Field(description="Name/Role of investigator conducting review")
    decision: str = Field(description="'Reviewed', 'Under_Human_Review', 'Saved', 'Approved', 'Needs_Revision'")
    comments: Optional[str] = None


class ReviewEventSchema(BaseModel):
    id: str
    event_type: str
    actor: str
    change_summary: str
    created_at: datetime

    class Config:
        from_attributes = True


class SourceDocumentSchema(BaseModel):
    id: str
    source_type: str
    original_filename: Optional[str] = None
    email_subject: Optional[str] = None
    extracted_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class InvestigationSummary(BaseModel):
    id: str
    incident_number: Optional[str] = None
    title: str
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    process_stage: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    causes_count: int = 0
    capa_count: int = 0
    evidence_gap_count: int = 0

    class Config:
        from_attributes = True


class InvestigationDetail(InvestigationBase):
    id: str
    reviewer_name: Optional[str] = None
    reviewer_decision: Optional[str] = None
    reviewer_comments: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    source_documents: List[SourceDocumentSchema] = Field(default_factory=list)
    evidence_items: List[EvidenceItemResponse] = Field(default_factory=list)
    root_causes: List[RootCauseSchema] = Field(default_factory=list)
    capa_actions: List[CapaActionSchema] = Field(default_factory=list)
    five_whys: List[FiveWhysStepSchema] = Field(default_factory=list)
    fishbone_factors: List[FishboneFactorSchema] = Field(default_factory=list)
    review_events: List[ReviewEventSchema] = Field(default_factory=list)

    class Config:
        from_attributes = True
