import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.core.database import get_db
from backend.app.models.investigation import Investigation
from backend.app.models.capa_action import CapaAction
from backend.app.schemas.capa import (
    CapaGenerateRequest,
    CapaGenerateResponse,
    CapaReviewRequest,
    CapaActionSchema
)
from backend.app.services.capa_service import generate_capa_for_investigation, review_capa_action

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/investigations/{investigation_id}/capa", response_model=CapaGenerateResponse)
def trigger_capa_generation(
    investigation_id: str,
    payload: Optional[CapaGenerateRequest] = None,
    db: Session = Depends(get_db)
):
    """
    Generate or regenerate CAPA recommendations for an existing investigation.
    """
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")

    context = {
        "title": inv.title,
        "product_name": inv.product_name,
        "batch_number": inv.batch_number,
        "observed_deviation": inv.observed_deviation,
        "equipment_id": inv.equipment_id
    }
    if payload and payload.incident_context:
        context.update(payload.incident_context)

    return generate_capa_for_investigation(
        incident_context=context,
        db=db,
        investigation_id=investigation_id
    )


@router.post("/capa-preview", response_model=CapaGenerateResponse)
def preview_capa_generation(payload: CapaGenerateRequest):
    """
    Generate CAPA recommendations from in-memory incident form state before saving to DB.
    """
    if not payload.incident_context:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="incident_context is required.")
    
    return generate_capa_for_investigation(incident_context=payload.incident_context)


@router.put("/investigations/{investigation_id}/capa/{capa_id}", response_model=CapaActionSchema)
def review_capa_endpoint(
    investigation_id: str,
    capa_id: str,
    payload: CapaReviewRequest,
    db: Session = Depends(get_db)
):
    """
    HUMAN REVIEW SAFEGUARD: Accept, Reject, or Modify a CAPA action recommendation.
    """
    try:
        updated_action = review_capa_action(
            db=db,
            investigation_id=investigation_id,
            capa_id=capa_id,
            decision=payload.review_decision,
            proposed_owner=payload.proposed_owner,
            target_due_date=payload.target_due_date,
            description=payload.description,
            rationale=payload.rationale,
            effectiveness_check_plan=payload.effectiveness_check_plan,
            review_notes=payload.review_notes
        )
        return updated_action
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to review CAPA: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/investigations/{investigation_id}/capa/manual", response_model=CapaActionSchema, status_code=status.HTTP_201_CREATED)
def create_manual_capa(
    investigation_id: str,
    payload: CapaActionSchema,
    db: Session = Depends(get_db)
):
    """Manually add an investigator-defined CAPA action."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")

    action = CapaAction(
        investigation_id=investigation_id,
        action_code=payload.action_code or "CAPA-M-01",
        action_type=payload.action_type,
        description=payload.description,
        rationale=payload.rationale,
        related_cause_id=payload.related_cause_id,
        proposed_owner=payload.proposed_owner,
        target_due_date=payload.target_due_date,
        status="Accepted",
        effectiveness_check_plan=payload.effectiveness_check_plan,
        review_decision="Accepted"
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action
