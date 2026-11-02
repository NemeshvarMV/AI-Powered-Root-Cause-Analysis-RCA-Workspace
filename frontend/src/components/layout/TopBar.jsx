import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { openModal } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function TopBar() {
  const dispatch = useDispatch();
  const { currentInvestigation, isDirty, isSaving } = useSelector((state) => state.investigation);
  const [health, setHealth] = useState({ connected: true, mode: 'checking' });

  useEffect(() => {
    apiClient.checkHealth()
      .then((data) => {
        setHealth({
          connected: data.database?.connected ?? true,
          mode: data.ai_engine?.mode || 'live_groq',
          model: data.ai_engine?.model || 'llama-3.3-70b-versatile',
        });
      })
      .catch(() => {
        setHealth({ connected: false, mode: 'offline' });
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AI_Analyzed':
        return <span className="badge badge-ai">AI Analysis Complete</span>;
      case 'Under_Human_Review':
        return <span className="badge badge-review">Under Human Review</span>;
      case 'Reviewed':
      case 'Approved':
        return <span className="badge badge-confirmed">Qualified Signoff</span>;
      case 'Saved':
        return <span className="badge badge-received">Saved in DB</span>;
      case 'Draft':
      default:
        return <span className="badge badge-draft">Draft Record</span>;
    }
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Current Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '15.5px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              {currentInvestigation.incident_number ? `${currentInvestigation.incident_number}: ` : ''}
              {currentInvestigation.title || 'New Unnamed Investigation'}
            </h1>
            {getStatusBadge(currentInvestigation.status)}
            {isDirty && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 500,
                }}
              >
                ● Unsaved Changes
              </span>
            )}
          </div>
          {currentInvestigation.product_name && (
            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              Product: <span style={{ color: '#cbd5e1' }}>{currentInvestigation.product_name}</span>
              {currentInvestigation.batch_number ? ` | Batch: ${currentInvestigation.batch_number}` : ''}
              {currentInvestigation.process_stage ? ` | Stage: ${currentInvestigation.process_stage}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls & Health */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend & AI Engine Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11.5px',
          }}
          title={`PostgreSQL: ${health.connected ? 'Connected' : 'Disconnected'} | Model: ${health.model || 'Groq'}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: health.connected ? '#10b981' : '#ef4444' }}>
            <Database size={13} />
            <span>PostgreSQL</span>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: health.mode === 'live_groq' ? '#38bdf8' : '#94a3b8' }}>
            <Cpu size={13} />
            <span>Groq LangGraph</span>
          </div>
        </div>

        {/* Human Review Signoff Button */}
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(openModal({ modal: 'review_signoff' }))}
          style={{ fontSize: '12.5px', padding: '7px 13px' }}
        >
          <UserCheck size={15} color="#38bdf8" />
          <span>Review & Signoff</span>
        </button>

        {/* Save Investigation Action */}
        <button
          className="btn btn-primary"
          onClick={() => dispatch(openModal({ modal: 'save_confirmation' }))}
          disabled={isSaving}
          style={{ fontSize: '12.5px', padding: '7px 15px' }}
        >
          <Save size={15} />
          <span>{isSaving ? 'Saving...' : 'Save Investigation'}</span>
        </button>
      </div>
    </header>
  );
}
