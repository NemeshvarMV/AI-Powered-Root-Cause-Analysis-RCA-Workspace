import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  Network,
  FileQuestion,
  ShieldCheck,
  History,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { setActiveTab } from '../../store/uiSlice';
import InvestigationForm from './InvestigationForm';
import RcaWorkspace from '../rca/RcaWorkspace';
import EvidenceGapTracker from '../evidence/EvidenceGapTracker';
import CapaManager from '../capa/CapaManager';
import AuditTrailViewer from '../review/AuditTrailViewer';

export default function WorkspaceView() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.ui);
  const { currentInvestigation } = useSelector((state) => state.investigation);
  const { fiveWhys, potentialRootCauses } = useSelector((state) => state.rca);
  const { evidenceItems } = useSelector((state) => state.evidence);
  const { capaActions } = useSelector((state) => state.capa);

  const tabs = [
    { id: 'details', label: 'Incident & Deviation Form', icon: FileText },
    {
      id: 'rca',
      label: 'Root Cause Analysis',
      icon: Network,
      count: potentialRootCauses.length || undefined,
    },
    {
      id: 'evidence',
      label: 'Evidence Gap Tracker',
      icon: FileQuestion,
      count: evidenceItems.filter((e) => e.status === 'Missing').length || undefined,
    },
    {
      id: 'capa',
      label: 'CAPA Management',
      icon: ShieldCheck,
      count: capaActions.length || undefined,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: History,
      count: currentInvestigation.review_events?.length || undefined,
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Workflow Stage Progress Ribbon */}
      <div
        className="glass-card"
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '4px',
                backgroundColor: currentInvestigation.observed_deviation ? '#10b981' : '#64748b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              1
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: currentInvestigation.observed_deviation ? '#f8fafc' : '#94a3b8' }}>
              Deviation Identification
            </span>
          </div>

          <ArrowRight size={14} color="#64748b" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '4px',
                backgroundColor: potentialRootCauses.length > 0 ? '#10b981' : '#64748b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              2
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: potentialRootCauses.length > 0 ? '#f8fafc' : '#94a3b8' }}>
              Root Cause Analysis (RCA)
            </span>
          </div>

          <ArrowRight size={14} color="#64748b" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '4px',
                backgroundColor: capaActions.length > 0 ? '#10b981' : '#64748b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              3
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: capaActions.length > 0 ? '#f8fafc' : '#94a3b8' }}>
              Corrective & Preventive Actions (CAPA)
            </span>
          </div>
        </div>

        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
          Human oversight active
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '2px',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                borderBottom: isActive ? '2px solid #38bdf8' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <div>
        {activeTab === 'details' && <InvestigationForm />}
        {activeTab === 'rca' && <RcaWorkspace />}
        {activeTab === 'evidence' && <EvidenceGapTracker />}
        {activeTab === 'capa' && <CapaManager />}
        {activeTab === 'audit' && <AuditTrailViewer />}
      </div>
    </div>
  );
}
