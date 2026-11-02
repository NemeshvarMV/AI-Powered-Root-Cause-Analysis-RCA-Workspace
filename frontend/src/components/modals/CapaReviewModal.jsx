import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, X } from 'lucide-react';
import { closeModal, addNotification } from '../../store/uiSlice';
import { setCapaReviewDecision } from '../../store/capaSlice';
import { apiClient } from '../../api/apiClient';

export default function CapaReviewModal() {
  const dispatch = useDispatch();
  const { modalPayload } = useSelector((state) => state.ui);
  const { currentInvestigation } = useSelector((state) => state.investigation);

  const [description, setDescription] = useState(modalPayload?.description || '');
  const [rationale, setRationale] = useState(modalPayload?.rationale || '');
  const [owner, setOwner] = useState(modalPayload?.proposed_owner || '');
  const [dueDate, setDueDate] = useState(modalPayload?.target_due_date || '');
  const [plan, setPlan] = useState(modalPayload?.effectiveness_check_plan || '');
  const [decision, setDecision] = useState(modalPayload?.review_decision || 'Accepted');

  if (!modalPayload) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setCapaReviewDecision({
      id: modalPayload.id,
      actionCode: modalPayload.action_code,
      decision,
      description,
      rationale,
      owner,
      dueDate,
      plan,
    }));

    if (currentInvestigation.id && modalPayload.id && !modalPayload.id.startsWith('temp-')) {
      try {
        await apiClient.reviewCapaAction(currentInvestigation.id, modalPayload.id, {
          review_decision: decision,
          description,
          rationale,
          proposed_owner: owner,
          target_due_date: dueDate,
          effectiveness_check_plan: plan,
        });
      } catch (err) {
        console.error('Failed to sync CAPA edit:', err);
      }
    }

    dispatch(addNotification({
      type: 'success',
      message: `CAPA ${modalPayload.action_code} updated successfully.`,
    }));
    dispatch(closeModal());
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
      <div className="glass-card" style={{ width: '600px', padding: '26px', backgroundColor: '#0f172a' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              Review & Edit CAPA Action ({modalPayload.action_code})
            </h3>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Review Decision</label>
            <select
              className="form-select"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="Accepted">Accepted (Approved for Implementation)</option>
              <option value="Modified">Modified (Edited by Investigator)</option>
              <option value="Rejected">Rejected (Infeasible or Unwarranted)</option>
              <option value="Pending">Pending Evaluation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Action Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rationale</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Proposed Owner / Department</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maintenance Engineering Lead"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Due Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2026-11-15 or 14 days"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Planned Effectiveness Check</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. Audit next 5 batches; verify no thermal excursion above 42°C"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(closeModal())}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save CAPA Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
