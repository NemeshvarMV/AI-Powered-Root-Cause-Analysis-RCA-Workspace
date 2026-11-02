from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class CapaActionSchema(BaseModel):
    id: Optional[str] = None
    action_code: str = Field(description="e.g. CAPA-C-01, CAPA-P-01")
    action_type: str = Field(description="'Corrective' or 'Preventive'")
    description: str
    rationale: str
    related_cause_id: Optional[str] = None
    supporting_evidence: Optional[str] = None
    proposed_owner: Optional[str] = None
    target_due_date: Optional[str] = None
    status: str = "Proposed"  # "Proposed", "Accepted", "Rejected", "In Progress", "Completed", "Closed"
    effectiveness_check_plan: Optional[str] = None
    review_decision: str = "Pending"  # "Pending", "Accepted", "Rejected", "Modified"
    review_notes: Optional[str] = None

    class Config:
        from_attributes = True


class CapaGenerateRequest(BaseModel):
    investigation_id: Optional[str] = None
    incident_context: Optional[dict] = None
    confirmed_causes: Optional[List[dict]] = None


class CapaGenerateResponse(BaseModel):
    success: bool
    actions: List[CapaActionSchema] = Field(default_factory=list)
    guidance_notes: str


class CapaReviewRequest(BaseModel):
    review_decision: str = Field(description="'Accepted', 'Rejected', or 'Modified'")
    status: Optional[str] = None
    proposed_owner: Optional[str] = None
    target_due_date: Optional[str] = None
    description: Optional[str] = None
    rationale: Optional[str] = None
    effectiveness_check_plan: Optional[str] = None
    review_notes: Optional[str] = None
