import React from 'react';
import { useSelector } from 'react-redux';
import { History, Clock, User, ShieldCheck } from 'lucide-react';

export default function AuditTrailViewer() {
  const { currentInvestigation } = useSelector((state) => state.investigation);
  const events = currentInvestigation.review_events || [];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <History size={20} color="#38bdf8" />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
          Data Integrity Audit Trail (ALCOA+ Compliance)
        </h3>
      </div>
      <p style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '20px' }}>
        Maintains an immutable chronological record of all AI extractions, investigator edits, cause confirmations, and signoff events.
      </p>

      {events.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          No audit events recorded yet for this investigation draft.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((ev, idx) => (
            <div
              key={ev.id || idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Clock size={14} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#38bdf8' }}>
                    {ev.event_type}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {ev.created_at ? new Date(ev.created_at).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
                  {ev.change_summary}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> Logged by: {ev.actor || 'Quality Investigator'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
