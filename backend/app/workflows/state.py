from typing import TypedDict, List, Dict, Any, Optional


class RcaWorkflowState(TypedDict):
    """
    Typed workflow state passed between LangGraph nodes during RCA orchestration.
    """
    # Source metadata and raw text
    source_type: str
    original_metadata: Dict[str, Any]
    raw_text: str
    
    # Extraction output
    extracted_fields: Dict[str, Any]
    source_evidence_refs: List[str]
    known_evidence: List[str]
    validation_errors: List[str]
    retry_count: int
    
    # Investigation & RCA details
    rca_method: str
    missing_evidence: List[Dict[str, Any]]
    five_whys: List[Dict[str, Any]]
    fishbone_factors: List[Dict[str, Any]]
    potential_root_causes: List[Dict[str, Any]]
    investigation_findings: List[str]
    
    # CAPA outputs
    capa_recommendations: List[Dict[str, Any]]
    
    # Overall orchestration state
    workflow_status: str
    execution_log: List[str]
