import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.core.database import get_db
from backend.app.models.investigation import Investigation
from backend.app.models.source_document import SourceDocument
from backend.app.models.evidence_item import EvidenceItem
from backend.app.models.root_cause import RootCause
from backend.app.models.capa_action import CapaAction
from backend.app.models.five_whys import FiveWhysStep
from backend.app.models.fishbone import FishboneFactor
from backend.app.models.review_event import ReviewEvent
from backend.app.schemas.investigation import (
    InvestigationCreate,
    InvestigationUpdate,
    InvestigationReviewRequest,
    InvestigationSummary,
    InvestigationDetail
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/investigations", response_model=InvestigationDetail, status_code=status.HTTP_201_CREATED)
def create_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(get_db)
):
    """
    Save reviewed investigation with all associated evidence, RCA, and CAPA data.
    Preserves transactional integrity across all related tables.
    """
    try:
        # Create parent investigation
        inv = Investigation(
            title=payload.title,
            incident_number=payload.incident_number,
            incident_description=payload.incident_description,
            product_name=payload.product_name,
            batch_number=payload.batch_number,
            incident_date=payload.incident_date,
            discovery_date=payload.discovery_date,
            process_stage=payload.process_stage,
            observed_deviation=payload.observed_deviation,
            expected_specification=payload.expected_specification,
            actual_result=payload.actual_result,
            immediate_containment=payload.immediate_containment,
            equipment_id=payload.equipment_id,
            material_lot_id=payload.material_lot_id,
            process_parameters=payload.process_parameters or {},
            status="Saved" if payload.status == "Saved" else (payload.status or "Draft")
        )
        db.add(inv)
        db.flush()  # assign inv.id

        # 1. Source Document
        if payload.raw_source_text:
            src = SourceDocument(
                investigation_id=inv.id,
                source_type=payload.source_type or "text",
                original_filename=payload.source_filename,
                extracted_text=payload.raw_source_text,
                metadata_json={"saved_at": datetime.utcnow().isoformat()}
            )
            db.add(src)

        # 2. Evidence Items
        if payload.evidence_items:
            for ev in payload.evidence_items:
                db.add(EvidenceItem(
                    investigation_id=inv.id,
                    item_description=ev.get("item_description", ""),
                    why_it_matters=ev.get("why_it_matters", ""),
                    related_cause_or_question=ev.get("related_cause_or_question"),
                    recommended_next_step=ev.get("recommended_next_step"),
                    evidence_type=ev.get("evidence_type"),
                    status=ev.get("status", "Missing"),
                    review_notes=ev.get("review_notes"),
                    source_reference=ev.get("source_reference")
                ))

        # 3. 5 Whys
        if payload.five_whys:
            for w in payload.five_whys:
                db.add(FiveWhysStep(
                    investigation_id=inv.id,
                    step_number=w.get("step_number", 1),
                    question=w.get("question", ""),
                    answer=w.get("answer", ""),
                    supporting_evidence=w.get("supporting_evidence"),
                    is_confirmed=w.get("is_confirmed", False),
                    evidence_status=w.get("evidence_status", "Hypothetical"),
                    follow_up_needed=w.get("follow_up_needed")
                ))

        # 4. Fishbone Factors
        if payload.fishbone_factors:
            for f in payload.fishbone_factors:
                db.add(FishboneFactor(
                    investigation_id=inv.id,
                    category=f.get("category", "Method"),
                    factor_title=f.get("factor_title", ""),
                    factor_detail=f.get("factor_detail"),
                    evidence_link=f.get("evidence_link"),
                    status=f.get("status", "Potential")
                ))

        # 5. Root Causes
        if payload.root_causes:
            for c in payload.root_causes:
                db.add(RootCause(
                    investigation_id=inv.id,
                    cause_code=c.get("cause_code", "RC-01"),
                    category=c.get("category"),
                    description=c.get("description", ""),
                    related_observation=c.get("related_observation"),
                    supporting_evidence=c.get("supporting_evidence"),
                    contradicting_evidence=c.get("contradicting_evidence"),
                    evidence_sufficiency=c.get("evidence_sufficiency", "Insufficient Evidence"),
                    status=c.get("status", "Proposed"),
                    is_human_confirmed=c.get("is_human_confirmed", False),
                    confirmed_by=c.get("confirmed_by"),
                    confirmation_notes=c.get("confirmation_notes"),
                    recommended_verification=c.get("recommended_verification"),
                    model_confidence=c.get("model_confidence")
                ))

        # 6. CAPA Actions
        if payload.capa_actions:
            for cap in payload.capa_actions:
                db.add(CapaAction(
                    investigation_id=inv.id,
                    action_code=cap.get("action_code", "CAPA-01"),
                    action_type=cap.get("action_type", "Corrective"),
                    description=cap.get("description", ""),
                    rationale=cap.get("rationale", ""),
                    related_cause_id=cap.get("related_cause_id"),
                    supporting_evidence=cap.get("supporting_evidence"),
                    proposed_owner=cap.get("proposed_owner"),
                    target_due_date=cap.get("target_due_date"),
                    status=cap.get("status", "Proposed"),
                    effectiveness_check_plan=cap.get("effectiveness_check_plan"),
                    review_decision=cap.get("review_decision", "Pending"),
                    review_notes=cap.get("review_notes")
                ))

        # 7. Audit Trail Event
        db.add(ReviewEvent(
            investigation_id=inv.id,
            event_type="SAVED",
            actor="Quality Investigator",
            change_summary="Investigation created and initial reviewed dataset saved to persistent storage."
        ))

        db.commit()
        db.refresh(inv)
        return inv
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create investigation: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}")


@router.get("/investigations", response_model=List[InvestigationSummary])
def list_investigations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List investigations with search and filter capabilities."""
    query = db.query(Investigation)
    if status_filter:
        query = query.filter(Investigation.status == status_filter)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Investigation.title.ilike(search_fmt)) |
            (Investigation.batch_number.ilike(search_fmt)) |
            (Investigation.product_name.ilike(search_fmt)) |
            (Investigation.incident_number.ilike(search_fmt))
        )
    
    investigations = query.order_by(desc(Investigation.created_at)).offset(skip).limit(limit).all()
    
    summaries = []
    for inv in investigations:
        summaries.append(InvestigationSummary(
            id=inv.id,
            incident_number=inv.incident_number,
            title=inv.title,
            product_name=inv.product_name,
            batch_number=inv.batch_number,
            process_stage=inv.process_stage,
            status=inv.status,
            created_at=inv.created_at,
            updated_at=inv.updated_at,
            causes_count=len(inv.root_causes),
            capa_count=len(inv.capa_actions),
            evidence_gap_count=len([e for e in inv.evidence_items if e.status == "Missing"])
        ))
    return summaries


@router.get("/investigations/{investigation_id}", response_model=InvestigationDetail)
def get_investigation_detail(
    investigation_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve full investigation record with associated evidence, RCA, and CAPA."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Investigation {investigation_id} not found.")
    return inv


@router.put("/investigations/{investigation_id}", response_model=InvestigationDetail)
def update_investigation(
    investigation_id: str,
    payload: InvestigationUpdate,
    db: Session = Depends(get_db)
):
    """Update editable investigation fields."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Investigation {investigation_id} not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(inv, field, val)
    inv.updated_at = datetime.utcnow()

    db.add(ReviewEvent(
        investigation_id=inv.id,
        event_type="UPDATED",
        actor="Quality Investigator",
        change_summary=f"Updated investigation fields: {', '.join(update_data.keys())}"
    ))

    db.commit()
    db.refresh(inv)
    return inv


@router.post("/investigations/{investigation_id}/review", response_model=InvestigationDetail)
def review_investigation(
    investigation_id: str,
    payload: InvestigationReviewRequest,
    db: Session = Depends(get_db)
):
    """Formal human review signoff and lifecycle state transition."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Investigation {investigation_id} not found.")

    inv.reviewer_name = payload.reviewer_name
    inv.reviewer_decision = payload.decision
    inv.reviewer_comments = payload.comments
    inv.reviewed_at = datetime.utcnow()
    inv.status = payload.decision  # e.g., "Reviewed", "Approved", "Needs_Revision"
    inv.updated_at = datetime.utcnow()

    db.add(ReviewEvent(
        investigation_id=inv.id,
        event_type="HUMAN_REVIEW",
        actor=payload.reviewer_name,
        change_summary=f"Investigation transitioned to '{payload.decision}'. Comments: {payload.comments or 'None'}"
    ))

    db.commit()
    db.refresh(inv)
    return inv


@router.delete("/investigations/{investigation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_investigation(
    investigation_id: str,
    db: Session = Depends(get_db)
):
    """Delete an investigation and cascade delete all child records."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Investigation {investigation_id} not found.")
    db.delete(inv)
    db.commit()
    return None
