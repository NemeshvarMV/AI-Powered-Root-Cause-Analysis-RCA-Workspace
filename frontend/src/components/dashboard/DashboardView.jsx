import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusCircle,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileQuestion,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderArchive,
} from 'lucide-react';
import {
  setInvestigationList,
  setListLoading,
  loadInvestigationDetail,
} from '../../store/investigationSlice';
import { setRcaData } from '../../store/rcaSlice';
import { setEvidenceItems } from '../../store/evidenceSlice';
import { setCapaData } from '../../store/capaSlice';
import { setActiveView, setActiveTab, addNotification, openModal } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function DashboardView() {
  const dispatch = useDispatch();
  const { investigationList, listLoading, currentInvestigation } = useSelector(
    (state) => state.investigation
  );
  const { potentialRootCauses } = useSelector((state) => state.rca);
  const { evidenceItems } = useSelector((state) => state.evidence);
  const { capaActions } = useSelector((state) => state.capa);

  useEffect(() => {
    dispatch(setListLoading(true));
    apiClient.getInvestigations()
      .then((data) => {
        dispatch(setInvestigationList(data));
      })
      .catch((err) => {
        console.error('Failed to load investigations list:', err);
      });
  }, [dispatch]);

  const handleOpenInvestigation = async (id) => {
    try {
      const full = await apiClient.getInvestigationDetail(id);
      dispatch(loadInvestigationDetail(full));
      dispatch(setRcaData({
        five_whys: full.five_whys,
        fishbone_factors: full.fishbone_factors,
        potential_root_causes: full.root_causes,
        reasoning_summary: full.review_events?.[0]?.change_summary || '',
      }));
      dispatch(setEvidenceItems(full.evidence_items));
      dispatch(setCapaData({ actions: full.capa_actions }));
      dispatch(setActiveView('workspace'));
      dispatch(setActiveTab('details'));
      dispatch(addNotification({
        type: 'info',
        message: `Loaded investigation ${full.incident_number || full.title}.`,
      }));
    } catch (err) {
      dispatch(addNotification({
        type: 'error',
        message: `Could not load investigation: ${err.message}`,
      }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AI_Analyzed':
        return <span className="badge badge-ai">AI Analyzed</span>;
      case 'Under_Human_Review':
        return <span className="badge badge-review">Under Review</span>;
      case 'Reviewed':
      case 'Approved':
        return <span className="badge badge-confirmed">Qualified Signoff</span>;
      case 'Saved':
        return <span className="badge badge-received">Saved</span>;
      case 'Draft':
      default:
        return <span className="badge badge-draft">Draft</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
              }}
            >
              Enterprise Quality Assurance
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>ICH Q7 • ICH Q9(R1) • ICH Q10</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            AI-Powered Root Cause Analysis Workspace
          </h2>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', marginTop: '4px', maxWidth: '640px' }}>
            Streamline pharmaceutical API deviation intake, automated 5 Whys and Fishbone investigation, missing evidence detection, and risk-aligned CAPA definitions.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn btn-ai"
            onClick={() => dispatch(setActiveView('new_investigation'))}
            style={{ padding: '11px 22px', fontSize: '14px' }}
          >
            <Sparkles size={16} />
            <span>New Investigation Intake</span>
          </button>
          {currentInvestigation.id && (
            <button
              className="btn btn-secondary"
              onClick={() => dispatch(setActiveView('workspace'))}
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              <span>Resume Active Workspace</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#94a3b8' }}>Saved Investigations</span>
            <FolderArchive size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {investigationList.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '4px' }}>
            Persistent in PostgreSQL
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#94a3b8' }}>Potential Root Causes</span>
            <TrendingUp size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {potentialRootCauses.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
            5 Whys & 6M Hypotheses
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#94a3b8' }}>Evidence Gaps Flagged</span>
            <FileQuestion size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {evidenceItems.filter((e) => e.status === 'Missing').length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#fbbf24', marginTop: '4px' }}>
            Actionable verification records
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#94a3b8' }}>CAPA Actions Planned</span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {capaActions.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '4px' }}>
            Corrective & Preventive
          </div>
        </div>
      </div>

      {/* Investigations Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              Quality Investigations Directory
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Select an investigation to inspect root causes, view evidence checklists, and manage CAPA.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              dispatch(setListLoading(true));
              apiClient.getInvestigations().then((d) => dispatch(setInvestigationList(d)));
            }}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Refresh Records
          </button>
        </div>

        {listLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading investigations from PostgreSQL...
          </div>
        ) : investigationList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <FolderArchive size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
              No Investigations Saved Yet
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
              Click "New Investigation Intake" to upload a deviation document or paste incident text.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 12px' }}>Incident Ref</th>
                  <th style={{ padding: '10px 12px' }}>Investigation Title</th>
                  <th style={{ padding: '10px 12px' }}>Product & Batch</th>
                  <th style={{ padding: '10px 12px' }}>Process Stage</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Gaps / Causes</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investigationList.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>
                      {inv.incident_number || 'DEV-DRAFT'}
                    </td>
                    <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 500, maxWidth: '280px' }}>
                      {inv.title}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      {inv.product_name || 'API Substance'}
                      {inv.batch_number ? ` (${inv.batch_number})` : ''}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>
                      {inv.process_stage || 'Manufacturing'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(inv.status)}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>
                      <span style={{ color: inv.evidence_gap_count > 0 ? '#fbbf24' : '#10b981' }}>
                        {inv.evidence_gap_count} gaps
                      </span>{' '}
                      • {inv.causes_count} causes
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenInvestigation(inv.id)}
                        style={{ fontSize: '11.5px', padding: '5px 12px' }}
                      >
                        <span>Open RCA</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
