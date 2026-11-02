import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.app.models.investigation import Investigation
from backend.app.models.capa_action import CapaAction
from backend.app.models.root_cause import RootCause
from backend.app.models.review_event import ReviewEvent
from backend.app.workflows.rca_graph import compiled_rca_graph
from backend.app.schemas.capa import CapaGenerateResponse, CapaActionSchema

logger = logging.getLogger(__name__)


def generate_capa_for_investigation(
    incident_context: Dict[str, Any],
    db: Optional[Session] = None,
    investigation_id: Optional[str] = None
) -> CapaGenerateResponse:
    """
    Generate Corrective and Preventive Action recommendations using LangGraph orchestration.
    """
    # Fetch existing confirmed causes if investigation_id and db are provided
    confirmed_causes_text = ""
    if db and investigation_id:
        causes = db.query(RootCause).filter(RootCause.investigation_id == investigation_id).all()
        confirmed_causes_text = "\n".join([f"- [{c.status}] {c.cause_code}: {c.description}" for c in causes])

    raw_text = f"""
Title: {incident_context.get('title', '')}
Product: {incident_context.get('product_name', '')}
Batch: {incident_context.get('batch_number', '')}
Observed Deviation: {incident_context.get('observed_deviation', '')}
Identified Root Causes:
{confirmed_causes_text}
"""
    state = {
        "source_type": "incident_context",
        "original_metadata": {},
        "raw_text": raw_text.strip(),
        "extracted_fields": incident_context,
        "retry_count": 0,
        "execution_log": []
    }

    graph_res = compiled_rca_graph.invoke(state)
    capas = [CapaActionSchema(**act) for act in graph_res.get("capa_recommendations", [])]
    guidance = "Actions must be reviewed and accepted by qualified personnel prior to implementation."

    # If db and investigation_id, persist newly generated proposed CAPAs
    if db and investigation_id:
        for c in capas:
            # Check if exists
            existing = db.query(CapaAction).filter(
                CapaAction.investigation_id == investigation_id,
                CapaAction.action_code == c.action_code
            ).first()
            if not existing:
                db.add(CapaAction(
                    investigation_id=investigation_id,
                    action_code=c.action_code,
                    action_type=c.action_type,
                    description=c.description,
                    rationale=c.rationale,
                    related_cause_id=c.related_cause_id,
                    proposed_owner=c.proposed_owner,
                    target_due_date=c.target_due_date,
                    status="Proposed",
                    effectiveness_check_plan=c.effectiveness_check_plan,
                    review_decision="Pending"
                ))
        db.add(ReviewEvent(
            investigation_id=investigation_id,
            event_type="CAPA_RECOMMENDED",
            actor="AI Assistant (LangGraph)",
            change_summary=f"Recommended {len(capas)} CAPA actions (Corrective & Preventive)."
        ))
        db.commit()

    return CapaGenerateResponse(
        success=True,
        actions=capas,
        guidance_notes=guidance
    )


def review_capa_action(
    db: Session,
    investigation_id: str,
    capa_id: str,
    decision: str,
    proposed_owner: Optional[str] = None,
    target_due_date: Optional[str] = None,
    description: Optional[str] = None,
    rationale: Optional[str] = None,
    effectiveness_check_plan: Optional[str] = None,
    review_notes: Optional[str] = None,
    reviewer_name: str = "Quality Reviewer"
) -> CapaAction:
    """
    HUMAN REVIEW ACTION: Accept, Reject, or Modify an AI-recommended CAPA item.
    """
    action = db.query(CapaAction).filter(
        CapaAction.id == capa_id,
        CapaAction.investigation_id == investigation_id
    ).first()
    if not action:
        raise ValueError("CAPA action not found.")

    action.review_decision = decision
    if decision == "Accepted":
        action.status = "Accepted"
    elif decision == "Rejected":
        action.status = "Rejected"
    elif decision == "Modified":
        action.status = "Accepted"

    if proposed_owner:
        action.proposed_owner = proposed_owner
    if target_due_date:
        action.target_due_date = target_due_date
    if description:
        action.description = description
    if rationale:
        action.rationale = rationale
    if effectiveness_check_plan:
        action.effectiveness_check_plan = effectiveness_check_plan
    if review_notes:
        action.review_notes = review_notes

    action.updated_at = datetime.utcnow()

    db.add(ReviewEvent(
        investigation_id=investigation_id,
        event_type="CAPA_REVIEWED",
        actor=reviewer_name,
        change_summary=f"CAPA {action.action_code} {decision.lower()} by {reviewer_name}."
    ))

    db.commit()
    db.refresh(action)
    return action
