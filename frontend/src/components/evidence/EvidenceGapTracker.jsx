import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileQuestion,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  Save,
} from 'lucide-react';
import {
  updateEvidenceItemStatus,
  addEvidenceItem,
} from '../../store/evidenceSlice';
import { addNotification } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function EvidenceGapTracker() {
  const dispatch = useDispatch();
  const { evidenceItems } = useSelector((state) => state.evidence);
  const { currentInvestigation } = useSelector((state) => state.investigation);

  const [newDesc, setNewDesc] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [newType, setNewType] = useState('Equipment Calibration Logs');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleStatusChange = async (item, newStatus) => {
    dispatch(updateEvidenceItemStatus({ id: item.id, status: newStatus }));

    if (currentInvestigation.id && !item.id.startsWith('temp-')) {
      try {
        await apiClient.updateEvidenceItem(currentInvestigation.id, item.id, {
          status: newStatus,
        });
        dispatch(addNotification({
          type: 'success',
          message: `Evidence status updated to ${newStatus}.`,
        }));
      } catch (err) {
        dispatch(addNotification({
          type: 'error',
          message: `Failed to update status on server: ${err.message}`,
        }));
      }
    }
  };

  const handleNotesChange = async (item, notes) => {
    dispatch(updateEvidenceItemStatus({ id: item.id, review_notes: notes }));
  };

  const handleCreateCustomItem = async (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      item_description: newDesc,
      why_it_matters: newWhy || 'Required by investigator to confirm root cause under cGMP.',
      evidence_type: newType,
      status: 'Missing',
      recommended_next_step: 'Request documentary evidence from operational unit.',
    };

    dispatch(addEvidenceItem(newItem));
    setNewDesc('');
    setNewWhy('');
    setShowAddModal(false);
    dispatch(addNotification({
      type: 'info',
      message: 'Added custom evidence item to investigation checklist.',
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reviewed':
        return <span className="badge badge-reviewed">Reviewed</span>;
      case 'Received':
        return <span className="badge badge-received">Received</span>;
      case 'Requested':
        return <span className="badge badge-requested">Requested</span>;
      case 'Missing':
      default:
        return <span className="badge badge-missing">Missing Gap</span>;
    }
  };

  const missingCount = evidenceItems.filter((e) => e.status === 'Missing').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileQuestion size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>
                Missing Evidence & Information-Gap Detection
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '3px' }}>
              Identifies missing records, analytical chromatograms, calibration logs, and SOP signoffs required to prove or disprove hypotheses under cGMP (ICH Q7).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: missingCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: missingCount > 0 ? '#f87171' : '#34d399',
                border: missingCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              {missingCount} Active Evidence Gaps
            </span>

            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(true)}
              style={{ fontSize: '12.5px', padding: '7px 12px' }}
            >
              <Plus size={15} />
              <span>Add Custom Evidence Gap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {evidenceItems.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <FileQuestion size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
              No Evidence Gaps Logged
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
              Run AI extraction on an incident document or add custom evidence requirements above.
            </p>
          </div>
        ) : (
          evidenceItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="glass-card"
              style={{
                padding: '18px 20px',
                borderLeft:
                  item.status === 'Reviewed'
                    ? '4px solid #10b981'
                    : item.status === 'Received'
                    ? '4px solid #38bdf8'
                    : item.status === 'Requested'
                    ? '4px solid #f59e0b'
                    : '4px solid #ef4444',
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
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                    }}
                  >
                    {item.evidence_type || 'Investigation Record'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                    {item.item_description}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusBadge(item.status)}

                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Missing">Mark as Missing Gap</option>
                    <option value="Requested">Mark as Requested</option>
                    <option value="Received">Mark as Received</option>
                    <option value="Reviewed">Mark as Reviewed & Verified</option>
                    <option value="Inconclusive">Mark as Inconclusive</option>
                  </select>
                </div>
              </div>

              {/* Why it Matters */}
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Regulatory / Risk Justification: </span>
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>{item.why_it_matters}</span>
              </div>

              {/* Recommended Next Step */}
              {item.recommended_next_step && (
                <div style={{ marginBottom: '10px', fontSize: '12px', color: '#38bdf8' }}>
                  <span style={{ fontWeight: 600 }}>Actionable Next Step: </span>
                  <span style={{ color: '#e2e8f0' }}>{item.recommended_next_step}</span>
                </div>
              )}

              {/* Review Notes Input */}
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add investigator review findings or reference to attached file..."
                  value={item.review_notes || ''}
                  onChange={(e) => handleNotesChange(item, e.target.value)}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Evidence Modal */}
      {showAddModal && (
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
          <div className="glass-card" style={{ width: '500px', padding: '24px', backgroundColor: '#0f172a' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
              Add Evidence Requirement to Investigation
            </h4>
            <form onSubmit={handleCreateCustomItem}>
              <div className="form-group">
                <label className="form-label">Evidence Type</label>
                <select
                  className="form-select"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Batch Manufacturing Records">Batch Manufacturing Records (BPCR)</option>
                  <option value="Analytical Testing Data">Analytical Testing Data (HPLC, GC, MS)</option>
                  <option value="Equipment Calibration Logs">Equipment Calibration & Sensor Logs</option>
                  <option value="Raw Material CoA">Raw Material & Solvent Certificate of Analysis</option>
                  <option value="Process Automation Logs">SCADA / PLC Automation Historian Logs</option>
                  <option value="SOP & Training Records">Standard Operating Procedures & Training Records</option>
                  <option value="Environmental Monitoring">Cleanroom Environmental & HVAC Logs</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Missing Record / Item Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Filter-dryer ANFD-02 vacuum pressure transmitter calibration cert"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pharmaceutical Risk Justification (Why it matters)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Explain why this record is required to establish or rule out failure mechanism..."
                  value={newWhy}
                  onChange={(e) => setNewWhy(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
