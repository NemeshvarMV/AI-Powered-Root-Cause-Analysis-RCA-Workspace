import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserCheck, Save, CheckCircle2, X } from 'lucide-react';
import { closeModal, addNotification, setActiveView } from '../../store/uiSlice';
import {
  setSavingState,
  setSaveError,
  loadInvestigationDetail,
  updateLifecycleStatus,
} from '../../store/investigationSlice';
import { apiClient } from '../../api/apiClient';

export default function InvestigationReviewModal() {
  const dispatch = useDispatch();
  const { currentInvestigation } = useSelector((state) => state.investigation);
  const { fiveWhys, fishboneFactors, potentialRootCauses } = useSelector((state) => state.rca);
  const { evidenceItems } = useSelector((state) => state.evidence);
  const { capaActions } = useSelector((state) => state.capa);
  const { activeModal } = useSelector((state) => state.ui);

  const isFormalSignoff = activeModal === 'review_signoff';

  const [reviewerName, setReviewerName] = useState(
    currentInvestigation.reviewer_name || 'Dr. Sarah Thornton (QA Operations Lead)'
  );
  const [decision, setDecision] = useState(
    isFormalSignoff ? 'Reviewed' : 'Saved'
  );
  const [comments, setComments] = useState(
    currentInvestigation.reviewer_comments ||
    'Root cause analysis completed following cGMP guidelines. CAPA actions scheduled and assigned.'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAndSignoff = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    dispatch(setSavingState(true));

    try {
      const payload = {
        title: currentInvestigation.title || 'Pharmaceutical API Deviation Investigation',
        incident_number: currentInvestigation.incident_number,
        incident_description: currentInvestigation.incident_description || currentInvestigation.observed_deviation || 'API quality deviation report',
        product_name: currentInvestigation.product_name,
        batch_number: currentInvestigation.batch_number,
        incident_date: currentInvestigation.incident_date,
        discovery_date: currentInvestigation.discovery_date,
        process_stage: currentInvestigation.process_stage,
        observed_deviation: currentInvestigation.observed_deviation,
        expected_specification: currentInvestigation.expected_specification,
        actual_result: currentInvestigation.actual_result,
        immediate_containment: currentInvestigation.immediate_containment,
        equipment_id: currentInvestigation.equipment_id,
        material_lot_id: currentInvestigation.material_lot_id,
        process_parameters: currentInvestigation.process_parameters || {},
        status: decision,
        // Children for initial transaction
        evidence_items: evidenceItems,
        root_causes: potentialRootCauses,
        capa_actions: capaActions,
        five_whys: fiveWhys,
        fishbone_factors: fishboneFactors,
      };

      let savedRecord;
      if (currentInvestigation.id) {
        // Update existing record
        savedRecord = await apiClient.updateInvestigation(currentInvestigation.id, {
          ...payload,
          reviewer_name: reviewerName,
          reviewer_decision: decision,
          reviewer_comments: comments,
        });

        // Trigger review log
        if (isFormalSignoff) {
          savedRecord = await apiClient.reviewInvestigation(currentInvestigation.id, {
            reviewer_name: reviewerName,
            decision,
            comments,
          });
        }
      } else {
        // Create new record
        savedRecord = await apiClient.createInvestigation(payload);
        if (isFormalSignoff) {
          savedRecord = await apiClient.reviewInvestigation(savedRecord.id, {
            reviewer_name: reviewerName,
            decision,
            comments,
          });
        }
      }

      dispatch(loadInvestigationDetail(savedRecord));
      dispatch(updateLifecycleStatus({
        status: decision,
        reviewer_name: reviewerName,
        reviewer_decision: decision,
        reviewer_comments: comments,
      }));

      dispatch(addNotification({
        type: 'success',
        title: isFormalSignoff ? 'Investigation Formally Signed Off' : 'Investigation Saved',
        message: `Investigation ${savedRecord.incident_number || savedRecord.title} committed to PostgreSQL.`,
      }));

      dispatch(closeModal());
    } catch (err) {
      dispatch(setSaveError(err.message));
      dispatch(addNotification({
        type: 'error',
        title: 'Save Operation Failed',
        message: err.message,
      }));
    } finally {
      setIsSaving(false);
      dispatch(setSavingState(false));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div className="glass-card" style={{ width: '560px', padding: '26px', backgroundColor: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isFormalSignoff ? <UserCheck size={20} color="#10b981" /> : <Save size={20} color="#38bdf8" />}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              {isFormalSignoff ? 'Formal Human Review Signoff (ICH Q7 / Q9)' : 'Save Reviewed Investigation to PostgreSQL'}
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveAndSignoff}>
          <div className="form-group">
            <label className="form-label">Qualified Reviewer Name & Title</label>
            <input
              type="text"
              className="form-input"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Review Lifecycle Status Transition</label>
            <select
              className="form-select"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="Reviewed">Reviewed & Qualified (Investigation Complete)</option>
              <option value="Under_Human_Review">Under Human Review (In Progress)</option>
              <option value="Saved">Saved (Draft Working Record)</option>
              <option value="Needs_Revision">Needs Revision (Send Back to Engineering/QC)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quality Review Comments & Approval Summary</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record review notes, CAPA assignments, or regulatory risk justifications..."
              required
            />
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '11.5px',
              color: '#cbd5e1',
              marginBottom: '16px',
            }}
          >
            Will persist {fiveWhys.length} 5-Why steps, {fishboneFactors.length} Fishbone factors, {potentialRootCauses.length} root causes, {evidenceItems.length} evidence records, and {capaActions.length} CAPA actions.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(closeModal())}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Persisting to Database...' : isFormalSignoff ? 'Signoff & Save' : 'Save Investigation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
