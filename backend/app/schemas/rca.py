from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class FiveWhysStepSchema(BaseModel):
    id: Optional[str] = None
    step_number: int = Field(ge=1, le=10)
    question: str
    answer: str
    supporting_evidence: Optional[str] = None
    is_confirmed: bool = False
    evidence_status: str = "Hypothetical"  # "Confirmed", "Hypothetical", "Needs Verification"
    follow_up_needed: Optional[str] = None

    class Config:
        from_attributes = True


class FishboneFactorSchema(BaseModel):
    id: Optional[str] = None
    category: str = Field(description="'Man', 'Machine', 'Method', 'Material', 'Measurement', 'Environment'")
    factor_title: str
    factor_detail: Optional[str] = None
    evidence_link: Optional[str] = None
    status: str = "Potential"  # "Potential", "Investigated", "Eliminated", "Key Factor"

    class Config:
        from_attributes = True


class RootCauseSchema(BaseModel):
    id: Optional[str] = None
    cause_code: str = Field(description="Code e.g. RC-01")
    category: Optional[str] = None
    description: str
    related_observation: Optional[str] = None
    supporting_evidence: Optional[str] = None
    contradicting_evidence: Optional[str] = None
    evidence_sufficiency: str = "Insufficient Evidence"  # "Sufficient", "Insufficient", "Inconclusive"
    status: str = "Proposed"  # "Proposed", "Under Investigation", "Supported by Evidence", "Insufficient Evidence", "Contradicted", "Investigator Confirmed", "Rejected"
    is_human_confirmed: bool = False
    confirmed_by: Optional[str] = None
    confirmed_at: Optional[datetime] = None
    confirmation_notes: Optional[str] = None
    recommended_verification: Optional[str] = None
    model_confidence: Optional[float] = None

    class Config:
        from_attributes = True


class CauseConfirmationRequest(BaseModel):
    reviewer_name: str = Field(description="Name or ID of qualified person confirming the cause")
    status: str = Field(description="'Investigator Confirmed' or 'Rejected'")
    confirmation_notes: str = Field(description="Investigator justification for confirmation/rejection")


class RcaGenerateRequest(BaseModel):
    investigation_id: Optional[str] = None
    method: str = Field(default="both", description="'5whys', 'fishbone', or 'both'")
    incident_context: Optional[dict] = None


class RcaGenerateResponse(BaseModel):
    success: bool
    method: str
    five_whys: List[FiveWhysStepSchema] = Field(default_factory=list)
    fishbone_factors: List[FishboneFactorSchema] = Field(default_factory=list)
    potential_root_causes: List[RootCauseSchema] = Field(default_factory=list)
    reasoning_summary: str
    evidence_gaps_identified: List[str] = Field(default_factory=list)
