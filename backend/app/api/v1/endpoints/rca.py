import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.core.database import get_db
from backend.app.models.investigation import Investigation
from backend.app.models.root_cause import RootCause
from backend.app.models.five_whys import FiveWhysStep
from backend.app.schemas.rca import (
    RcaGenerateRequest,
    RcaGenerateResponse,
    CauseConfirmationRequest,
    RootCauseSchema,
    FiveWhysStepSchema
)
from backend.app.services.rca_service import generate_rca_for_incident, confirm_root_cause

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/investigations/{investigation_id}/rca", response_model=RcaGenerateResponse)
def trigger_rca_generation(
    investigation_id: str,
    payload: Optional[RcaGenerateRequest] = None,
    db: Session = Depends(get_db)
):
    """
    Generate or regenerate 5 Whys and Fishbone RCA for an existing investigation.
    """
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")

    context = {
        "title": inv.title,
        "product_name": inv.product_name,
        "batch_number": inv.batch_number,
        "observed_deviation": inv.observed_deviation,
        "process_stage": inv.process_stage,
        "equipment_id": inv.equipment_id,
        "expected_specification": inv.expected_specification,
        "actual_result": inv.actual_result,
        "immediate_containment": inv.immediate_containment,
        "known_evidence": [e.item_description for e in inv.evidence_items]
    }
    if payload and payload.incident_context:
        context.update(payload.incident_context)

    method = payload.method if payload else "both"
    return generate_rca_for_incident(
        incident_context=context,
        method=method,
        db=db,
        investigation_id=investigation_id
    )


@router.post("/rca-preview", response_model=RcaGenerateResponse)
def preview_rca_generation(payload: RcaGenerateRequest):
    """
    Generate RCA analysis from in-memory incident form state before saving to DB.
    """
    if not payload.incident_context:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="incident_context is required.")
    
    return generate_rca_for_incident(
        incident_context=payload.incident_context,
        method=payload.method or "both"
    )


@router.post("/investigations/{investigation_id}/rca/causes/{cause_id}/confirm", response_model=RootCauseSchema)
def confirm_cause_endpoint(
    investigation_id: str,
    cause_id: str,
    payload: CauseConfirmationRequest,
    db: Session = Depends(get_db)
):
    """
    HUMAN OVERSIGHT SAFEGUARD: Qualified investigator confirms or rejects an AI-proposed cause.
    """
    try:
        cause = confirm_root_cause(
            db=db,
            investigation_id=investigation_id,
            cause_id=cause_id,
            reviewer_name=payload.reviewer_name,
            status=payload.status,
            confirmation_notes=payload.confirmation_notes
        )
        return cause
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to confirm root cause: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/investigations/{investigation_id}/rca/five-whys/{step_id}", response_model=FiveWhysStepSchema)
def update_five_whys_step(
    investigation_id: str,
    step_id: str,
    payload: FiveWhysStepSchema,
    db: Session = Depends(get_db)
):
    """Edit or update a 5-Whys step."""
    step = db.query(FiveWhysStep).filter(
        FiveWhysStep.id == step_id,
        FiveWhysStep.investigation_id == investigation_id
    ).first()
    if not step:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="5-Whys step not found.")

    step.question = payload.question
    step.answer = payload.answer
    step.supporting_evidence = payload.supporting_evidence
    step.is_confirmed = payload.is_confirmed
    step.evidence_status = payload.evidence_status
    step.follow_up_needed = payload.follow_up_needed
    step.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(step)
    return step
