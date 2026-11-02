import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit,
  Sparkles,
  Plus,
  RefreshCw,
  Clock,
  User,
  Calendar,
  Activity,
  FileCheck,
} from 'lucide-react';
import {
  setCapaGenerating,
  setCapaData,
  setCapaReviewDecision,
  addManualCapaAction,
} from '../../store/capaSlice';
import { openModal, addNotification } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function CapaManager() {
  const dispatch = useDispatch();
  const { currentInvestigation } = useSelector((state) => state.investigation);
  const { capaActions, guidanceNotes, isGenerating } = useSelector((state) => state.capa);
  const { potentialRootCauses } = useSelector((state) => state.rca);

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'corrective', 'preventive'

  const runCapaGeneration = async () => {
    dispatch(setCapaGenerating(true));
    try {
      const context = {
        title: currentInvestigation.title,
        product_name: currentInvestigation.product_name,
        batch_number: currentInvestigation.batch_number,
        observed_deviation: currentInvestigation.observed_deviation,
        equipment_id: currentInvestigation.equipment_id,
      };

      let res;
      if (currentInvestigation.id) {
        res = await apiClient.generateCapa(currentInvestigation.id, context);
      } else {
        res = await apiClient.previewCapa(context);
      }

      dispatch(setCapaData(res));
      dispatch(addNotification({
        type: 'success',
        title: 'CAPA Recommendations Generated',
        message: `Recommended ${res.actions?.length || 0} Corrective & Preventive Actions.`,
      }));
    } catch (err) {
      dispatch(setCapaGenerating(false));
      dispatch(addNotification({
        type: 'error',
        title: 'CAPA Generation Failed',
        message: err.message,
      }));
    }
  };

  const handleDecision = async (action, decision) => {
    dispatch(setCapaReviewDecision({
      id: action.id,
      actionCode: action.action_code,
      decision,
    }));

    if (currentInvestigation.id && action.id && !action.id.startsWith('temp-')) {
      try {
        await apiClient.reviewCapaAction(currentInvestigation.id, action.id, {
          review_decision: decision,
        });
      } catch (err) {
        console.error('Failed to sync CAPA review:', err);
      }
    }

    dispatch(addNotification({
      type: decision === 'Accepted' ? 'success' : 'info',
      message: `CAPA ${action.action_code} has been marked as ${decision}.`,
    }));
  };

  const filteredActions = capaActions.filter((a) => {
    if (activeTab === 'corrective') return a.action_type === 'Corrective';
    if (activeTab === 'preventive') return a.action_type === 'Preventive';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>
                Corrective and Preventive Actions (CAPA Tracking)
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '3px' }}>
              ICH Q10 Quality System CAPA module. Actions require explicit investigator review, assigned ownership, and scheduled effectiveness checks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn btn-ai"
              onClick={runCapaGeneration}
              disabled={isGenerating}
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={15} className="spinner" />
                  <span>Generating via LangGraph...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Recommend CAPA Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {guidanceNotes && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '12.5px',
              color: '#e2e8f0',
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: '#34d399' }}>Quality Risk Guidance: </strong>
            {guidanceNotes}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          All Actions ({capaActions.length})
        </button>
        <button
          onClick={() => setActiveTab('corrective')}
          className={`btn ${activeTab === 'corrective' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          Corrective Actions ({capaActions.filter((a) => a.action_type === 'Corrective').length})
        </button>
        <button
          onClick={() => setActiveTab('preventive')}
          className={`btn ${activeTab === 'preventive' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          Preventive Actions ({capaActions.filter((a) => a.action_type === 'Preventive').length})
        </button>
      </div>

      {/* CAPA Actions Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredActions.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <ShieldCheck size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
              No CAPA Recommendations Yet
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
              Click "Recommend CAPA Plan" to generate evidence-aligned corrective and preventive actions.
            </p>
          </div>
        ) : (
          filteredActions.map((action, idx) => (
            <div
              key={action.id || action.action_code || idx}
              className="glass-card"
              style={{
                padding: '20px',
                borderLeft:
                  action.action_type === 'Corrective'
                    ? '4px solid #0284c7'
                    : '4px solid #0d9488',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: action.action_type === 'Corrective' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(13, 148, 136, 0.2)',
                      color: action.action_type === 'Corrective' ? '#38bdf8' : '#2dd4bf',
                    }}
                  >
                    {action.action_type} Action
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#cbd5e1' }}>
                    {action.action_code}
                  </span>
                  {action.related_cause_id && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      (Tied to {action.related_cause_id})
                    </span>
                  )}
                </div>

                {/* Review Decision Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`badge ${
                      action.review_decision === 'Accepted'
                        ? 'badge-confirmed'
                        : action.review_decision === 'Rejected'
                        ? 'badge-rejected'
                        : 'badge-review'
                    }`}
                  >
                    {action.review_decision}
                  </span>

                  {action.review_decision === 'Pending' && (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDecision(action, 'Accepted')}
                        style={{ fontSize: '11.5px', padding: '5px 10px', color: '#34d399' }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Accept</span>
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDecision(action, 'Rejected')}
                        style={{ fontSize: '11.5px', padding: '5px 10px', color: '#f87171' }}
                      >
                        <XCircle size={13} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  <button
                    className="btn btn-secondary"
                    onClick={() => dispatch(openModal({ modal: 'edit_capa', data: action }))}
                    style={{ fontSize: '11.5px', padding: '5px 10px' }}
                  >
                    <Edit size={13} />
                    <span>Edit Action</span>
                  </button>
                </div>
              </div>

              {/* Description & Rationale */}
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                  {action.description}
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.4 }}>
                  <strong style={{ color: '#cbd5e1' }}>Rationale: </strong>
                  {action.rationale}
                </p>
              </div>

              {/* Assigned Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 2fr',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '12px',
                }}
              >
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> Proposed Owner
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                    {action.proposed_owner || 'Unassigned'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Target Due Date
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                    {action.target_due_date || 'Pending Scheduling'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} /> Planned Effectiveness Check
                  </div>
                  <div style={{ color: '#cbd5e1', marginTop: '2px', lineHeight: 1.3 }}>
                    {action.effectiveness_check_plan || 'To be defined prior to closure.'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
