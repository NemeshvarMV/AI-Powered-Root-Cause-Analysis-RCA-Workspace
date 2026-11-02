import logging
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.investigation import Investigation
from backend.app.models.evidence_item import EvidenceItem
from backend.app.models.review_event import ReviewEvent
from backend.app.schemas.evidence import (
    EvidenceItemCreate,
    EvidenceItemUpdate,
    EvidenceItemResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/investigations/{investigation_id}/evidence", response_model=List[EvidenceItemResponse])
def get_evidence_items(
    investigation_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve all evidence items and gap records for an investigation."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")
    return inv.evidence_items


@router.post("/investigations/{investigation_id}/evidence", response_model=EvidenceItemResponse, status_code=status.HTTP_201_CREATED)
def add_evidence_item(
    investigation_id: str,
    payload: EvidenceItemCreate,
    db: Session = Depends(get_db)
):
    """Add a new evidence item or requested document to the investigation checklist."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")

    item = EvidenceItem(
        investigation_id=investigation_id,
        item_description=payload.item_description,
        why_it_matters=payload.why_it_matters,
        related_cause_or_question=payload.related_cause_or_question,
        recommended_next_step=payload.recommended_next_step,
        evidence_type=payload.evidence_type,
        status=payload.status or "Missing",
        review_notes=payload.review_notes,
        source_reference=payload.source_reference
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/investigations/{investigation_id}/evidence/{evidence_id}", response_model=EvidenceItemResponse)
def update_evidence_item(
    investigation_id: str,
    evidence_id: str,
    payload: EvidenceItemUpdate,
    db: Session = Depends(get_db)
):
    """Update evidence status (Missing -> Requested -> Received -> Reviewed) and notes."""
    item = db.query(EvidenceItem).filter(
        EvidenceItem.id == evidence_id,
        EvidenceItem.investigation_id == investigation_id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence item not found.")

    old_status = item.status
    if payload.status:
        item.status = payload.status
    if payload.review_notes is not None:
        item.review_notes = payload.review_notes
    if payload.item_description:
        item.item_description = payload.item_description
    if payload.why_it_matters:
        item.why_it_matters = payload.why_it_matters
    if payload.recommended_next_step:
        item.recommended_next_step = payload.recommended_next_step

    item.updated_at = datetime.utcnow()

    if payload.status and payload.status != old_status:
        db.add(ReviewEvent(
            investigation_id=investigation_id,
            event_type="EVIDENCE_STATUS_UPDATED",
            actor="Quality Investigator",
            change_summary=f"Evidence '{item.item_description[:40]}' status changed from '{old_status}' to '{payload.status}'"
        ))

    db.commit()
    db.refresh(item)
    return item
