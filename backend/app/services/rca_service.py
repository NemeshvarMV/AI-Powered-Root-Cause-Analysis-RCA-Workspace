import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.models.investigation import Investigation
from backend.app.models.root_cause import RootCause
from backend.app.models.five_whys import FiveWhysStep
from backend.app.models.fishbone import FishboneFactor
from backend.app.models.review_event import ReviewEvent
from backend.app.workflows.rca_graph import compiled_rca_graph
from backend.app.schemas.rca import RcaGenerateResponse, FiveWhysStepSchema, FishboneFactorSchema, RootCauseSchema

logger = logging.getLogger(__name__)


def generate_rca_for_incident(
    incident_context: Dict[str, Any],
    method: str = "both",
    db: Optional[Session] = None,
    investigation_id: Optional[str] = None
) -> RcaGenerateResponse:
    """
    Generate or regenerate RCA analysis (5 Whys and/or Fishbone + Potential Root Causes)
    using LangGraph orchestration with strict methodology compliance.
    """
    raw_method = method or "both"
    norm_method = raw_method.strip().lower()
    if norm_method in ["6m", "fishbone"]:
        norm_method = "fishbone"
    elif norm_method in ["5whys", "5_whys", "five_whys"]:
        norm_method = "5whys"
    else:
        norm_method = "both"

    raw_text = f"""
Title: {incident_context.get('title', '')}
Product: {incident_context.get('product_name', '')}
Batch: {incident_context.get('batch_number', '')}
Observed Deviation: {incident_context.get('observed_deviation', '')}
Stage: {incident_context.get('process_stage', '')}
Equipment: {incident_context.get('equipment_id', '')}
Expected Specification: {incident_context.get('expected_specification', '')}
Actual Result: {incident_context.get('actual_result', '')}
Immediate Containment: {incident_context.get('immediate_containment', '')}
Known Evidence: {', '.join(incident_context.get('known_evidence', []))}
"""
    state = {
        "source_type": "incident_context",
        "original_metadata": {},
        "raw_text": raw_text.strip(),
        "extracted_fields": incident_context,
        "rca_method": norm_method,
        "retry_count": 0,
        "execution_log": []
    }

    graph_res = compiled_rca_graph.invoke(state)

    whys = [FiveWhysStepSchema(**w) for w in graph_res.get("five_whys", [])] if norm_method != "fishbone" else []
    factors = [FishboneFactorSchema(**f) for f in graph_res.get("fishbone_factors", [])] if norm_method != "5whys" else []
    causes = [RootCauseSchema(**c) for c in graph_res.get("potential_root_causes", [])]
    summary = " ".join(graph_res.get("investigation_findings", []))
    gaps = [m.get("item_description", "") for m in graph_res.get("missing_evidence", [])]

    # If investigation_id and db are provided, persist/sync the generated RCA
    if db and investigation_id:
        inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
        if inv:
            # Clear old generated unconfirmed items if regenerating
            db.query(FiveWhysStep).filter(FiveWhysStep.investigation_id == investigation_id).delete()
            db.query(FishboneFactor).filter(FishboneFactor.investigation_id == investigation_id).delete()
            # Only delete non-human-confirmed causes
            db.query(RootCause).filter(
                RootCause.investigation_id == investigation_id,
                RootCause.is_human_confirmed == False
            ).delete()

            # Save 5 Whys if selected
            for w in whys:
                db.add(FiveWhysStep(
                    investigation_id=investigation_id,
                    step_number=w.step_number,
                    question=w.question,
                    answer=w.answer,
                    supporting_evidence=w.supporting_evidence,
                    is_confirmed=w.is_confirmed,
                    evidence_status=w.evidence_status,
                    follow_up_needed=w.follow_up_needed
                ))

            # Save Fishbone if selected
            for f in factors:
                db.add(FishboneFactor(
                    investigation_id=investigation_id,
                    category=f.category,
                    factor_title=f.factor_title,
                    factor_detail=f.factor_detail,
                    evidence_link=f.evidence_link,
                    status=f.status
                ))

            # Save Root Causes
            for c in causes:
                db.add(RootCause(
                    investigation_id=investigation_id,
                    cause_code=c.cause_code,
                    category=c.category,
                    description=c.description,
                    related_observation=c.related_observation,
                    supporting_evidence=c.supporting_evidence,
                    contradicting_evidence=c.contradicting_evidence,
                    evidence_sufficiency=c.evidence_sufficiency,
                    status="Proposed",
                    is_human_confirmed=False,
                    recommended_verification=c.recommended_verification,
                    model_confidence=c.model_confidence
                ))

            # Log audit event
            db.add(ReviewEvent(
                investigation_id=investigation_id,
                event_type="RCA_GENERATED",
                actor="AI Assistant (LangGraph)",
                change_summary=f"Generated RCA with method '{norm_method}': {len(whys)} 5-Why steps, {len(factors)} fishbone factors, and {len(causes)} potential root causes."
            ))
            db.commit()

    return RcaGenerateResponse(
        success=True,
        method=norm_method,
        five_whys=whys,
        fishbone_factors=factors,
        potential_root_causes=causes,
        reasoning_summary=summary,
        evidence_gaps_identified=gaps
    )


def confirm_root_cause(
    db: Session,
    investigation_id: str,
    cause_id: str,
    reviewer_name: str,
    status: str,
    confirmation_notes: str
) -> RootCause:
    """
    HUMAN OVERSIGHT ACTION: Qualified investigator confirms or rejects an AI-proposed root cause.
    """
    cause = db.query(RootCause).filter(
        RootCause.id == cause_id,
        RootCause.investigation_id == investigation_id
    ).first()
    if not cause:
        raise ValueError("Root cause not found.")

    cause.status = status
    cause.is_human_confirmed = (status == "Investigator Confirmed")
    cause.confirmed_by = reviewer_name
    cause.confirmed_at = datetime.utcnow()
    cause.confirmation_notes = confirmation_notes
    cause.updated_at = datetime.utcnow()

    # Audit Trail
    db.add(ReviewEvent(
        investigation_id=investigation_id,
        event_type="CAUSE_CONFIRMED" if cause.is_human_confirmed else "CAUSE_STATUS_UPDATED",
        actor=reviewer_name,
        change_summary=f"Cause {cause.cause_code} status set to '{status}' by {reviewer_name}. Notes: {confirmation_notes}"
    ))

    db.commit()
    db.refresh(cause)
    return cause
