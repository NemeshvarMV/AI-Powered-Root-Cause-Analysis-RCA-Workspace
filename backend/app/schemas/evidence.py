from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class EvidenceItemBase(BaseModel):
    item_description: str = Field(description="Description of the evidence item or missing record")
    why_it_matters: str = Field(description="Pharmaceutical rationale for why this evidence is critical")
    related_cause_or_question: Optional[str] = Field(default=None, description="Hypothesis or question this evidence addresses")
    recommended_next_step: Optional[str] = Field(default=None, description="Actionable step to obtain or verify")
    evidence_type: Optional[str] = Field(default=None, description="Type: Batch Records, Analytical Data, Calibration, etc.")
    status: str = Field(default="Missing", description="'Missing', 'Requested', 'Received', 'Reviewed', 'Inconclusive'")
    review_notes: Optional[str] = Field(default=None, description="Notes by investigator")
    source_reference: Optional[str] = Field(default=None)


class EvidenceItemCreate(EvidenceItemBase):
    pass


class EvidenceItemUpdate(BaseModel):
    status: Optional[str] = None
    review_notes: Optional[str] = None
    item_description: Optional[str] = None
    why_it_matters: Optional[str] = None
    recommended_next_step: Optional[str] = None


class EvidenceItemResponse(EvidenceItemBase):
    id: str
    investigation_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
