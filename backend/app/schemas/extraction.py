from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class IncidentExtractionSchema(BaseModel):
    """Structured Pydantic schema for pharmaceutical API quality incident extraction."""
    title: str = Field(description="Clear, descriptive title of the quality incident")
    incident_number: Optional[str] = Field(default=None, description="Deviation or incident reference number if found, else null")
    product_name: Optional[str] = Field(default=None, description="Active Pharmaceutical Ingredient (API) or intermediate name")
    batch_number: Optional[str] = Field(default=None, description="Batch or lot identifier")
    incident_date: Optional[str] = Field(default=None, description="Date and time when the incident occurred")
    discovery_date: Optional[str] = Field(default=None, description="Date when deviation was discovered/reported")
    process_stage: Optional[str] = Field(default=None, description="Manufacturing stage e.g. Synthesis, Crystallization, Drying, Milling, Packaging")
    
    observed_deviation: Optional[str] = Field(default=None, description="Specific out-of-specification or unexpected observation")
    expected_specification: Optional[str] = Field(default=None, description="Validated limit or specification range if stated")
    actual_result: Optional[str] = Field(default=None, description="Actual measured value or observed state including units")
    immediate_containment: Optional[str] = Field(default=None, description="Immediate actions already taken e.g. quarantine, QA hold")
    
    equipment_id: Optional[str] = Field(default=None, description="Equipment or instrument tag/ID (e.g. CRYS-RX-04, ANFD-02)")
    material_lot_id: Optional[str] = Field(default=None, description="Raw material, reagent, or solvent batch number")
    process_parameters: Dict[str, Any] = Field(default_factory=dict, description="Key parameters e.g. temperature, agitation speed, pH, pressure")
    
    source_references: List[str] = Field(default_factory=list, description="Citations or excerpts from the source document")
    known_evidence: List[str] = Field(default_factory=list, description="Explicit facts verified in the source")
    missing_information: List[str] = Field(default_factory=list, description="Identified data gaps or unrecorded parameters")
    additional_investigation_questions: List[str] = Field(default_factory=list, description="Critical questions to pursue in investigation")
    
    extraction_confidence: float = Field(default=0.85, description="Self-reported model confidence in extraction (uncalibrated estimate)")


class ExtractionRequest(BaseModel):
    source_type: str = Field(description="'pdf', 'text', or 'email'")
    content: Optional[str] = Field(default=None, description="Text or email body content")
    subject: Optional[str] = Field(default=None, description="Email subject line if applicable")
    filename: Optional[str] = Field(default=None, description="Original filename if applicable")


class ExtractionResponse(BaseModel):
    success: bool
    source_type: str
    original_reference: Optional[str] = None
    extracted_data: IncidentExtractionSchema
    raw_text_preview: str
    warnings: List[str] = Field(default_factory=list)
