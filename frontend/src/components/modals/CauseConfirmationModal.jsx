import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserCheck, ShieldAlert, X } from 'lucide-react';
import { closeModal, addNotification } from '../../store/uiSlice';
import { confirmRootCauseInStore } from '../../store/rcaSlice';
import { apiClient } from '../../api/apiClient';

export default function CauseConfirmationModal() {
  const dispatch = useDispatch();
  const { modalPayload } = useSelector((state) => state.ui);
  const { currentInvestigation } = useSelector((state) => state.investigation);

  const [reviewerName, setReviewerName] = useState('Dr. Sarah Thornton (Head of QA)');
  const [decision, setDecision] = useState('Investigator Confirmed');
  const [notes, setNotes] = useState(
    'Engineering shop physical teardown confirmed mechanical sticking of actuator diaphragm V-104 due to particulate fouling.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!modalPayload) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !notes.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Reviewer name and technical justification notes are required for cause confirmation.',
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentInvestigation.id && modalPayload.id && !modalPayload.id.startsWith('temp-')) {
        await apiClient.confirmRootCause(currentInvestigation.id, modalPayload.id, {
          reviewer_name: reviewerName,
          status: decision,
          confirmation_notes: notes,
        });
      }

      dispatch(confirmRootCauseInStore({
        causeId: modalPayload.id || modalPayload.cause_code,
        status: decision,
        reviewerName,
        notes,
      }));

      dispatch(addNotification({
        type: 'success',
        title: 'Cause Status Updated',
        message: `${modalPayload.cause_code} set to '${decision}' by ${reviewerName}.`,
      }));

      dispatch(closeModal());
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: `Failed to confirm cause: ${err.message}`,
      }));
    } finally {
      setIsSubmitting(false);
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
            <UserCheck size={20} color="#10b981" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              Human Oversight: Root Cause Confirmation
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '16px',
            fontSize: '12.5px',
          }}
        >
          <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
            {modalPayload.cause_code}: {modalPayload.description}
          </div>
          <div style={{ color: '#94a3b8' }}>
            Category: {modalPayload.category || 'Process'} | Current Status: {modalPayload.status}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Review Decision</label>
            <select
              className="form-select"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="Investigator Confirmed">Investigator Confirmed (Root Cause Established)</option>
              <option value="Under Investigation">Under Investigation (Awaiting Further Evidence)</option>
              <option value="Rejected">Rejected (Disproven by Physical / Lab Evidence)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Documentary Justification & Verification Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cite specific test reports, work orders, or forensic findings that justify this decision..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(closeModal())}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Decision...' : 'Record Human Signoff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
