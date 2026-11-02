import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FolderArchive,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  setInvestigationList,
  setListLoading,
  loadInvestigationDetail,
} from '../../store/investigationSlice';
import { setRcaData } from '../../store/rcaSlice';
import { setEvidenceItems } from '../../store/evidenceSlice';
import { setCapaData } from '../../store/capaSlice';
import { setActiveView, setActiveTab, addNotification } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function SavedInvestigationsView() {
  const dispatch = useDispatch();
  const { investigationList, listLoading } = useSelector((state) => state.investigation);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRecords = () => {
    dispatch(setListLoading(true));
    apiClient.getInvestigations({ search: searchTerm, status: statusFilter })
      .then((data) => {
        dispatch(setInvestigationList(data));
      })
      .catch((err) => {
        dispatch(addNotification({ type: 'error', message: err.message }));
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const handleOpen = async (id) => {
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
        message: `Loaded ${full.incident_number || full.title}.`,
      }));
    } catch (err) {
      dispatch(addNotification({ type: 'error', message: err.message }));
    }
  };

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete investigation "${title}"? This will remove all associated RCA and CAPA records.`)) {
      return;
    }

    try {
      await apiClient.deleteInvestigation(id);
      dispatch(addNotification({ type: 'success', message: 'Investigation deleted.' }));
      fetchRecords();
    } catch (err) {
      dispatch(addNotification({ type: 'error', message: err.message }));
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderArchive size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>
                Saved RCA Investigations Archive
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '3px' }}>
              Persistent repository of pharmaceutical quality investigations stored in PostgreSQL.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search product, batch, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRecords()}
                style={{ paddingLeft: '32px', fontSize: '12.5px' }}
              />
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '13px' }} />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: '180px', fontSize: '12.5px', padding: '7px 10px' }}
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="AI_Analyzed">AI Analyzed</option>
              <option value="Under_Human_Review">Under Human Review</option>
              <option value="Reviewed">Qualified Signoff</option>
              <option value="Saved">Saved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Investigation Cards */}
      {listLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          Loading records from PostgreSQL database...
        </div>
      ) : investigationList.length === 0 ? (
        <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}>
          <FolderArchive size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
            No Matching Investigations Found
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Try adjusting your search criteria or create a new investigation.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {investigationList.map((inv) => (
            <div
              key={inv.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => handleOpen(inv.id)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
                    {inv.incident_number || 'DEV-UNASSIGNED'}
                  </span>
                  {getStatusBadge(inv.status)}
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  {inv.title}
                </h4>

                <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginBottom: '12px' }}>
                  <strong>Product: </strong>{inv.product_name || 'API Substance'}
                  {inv.batch_number ? ` • Batch ${inv.batch_number}` : ''}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '11.5px',
                    color: '#94a3b8',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  }}
                >
                  <span>Stage: {inv.process_stage || 'Manufacturing'}</span>
                  <span>•</span>
                  <span>{inv.causes_count} Causes</span>
                  <span>•</span>
                  <span>{inv.capa_count} CAPAs</span>
                  <span>•</span>
                  <span style={{ color: inv.evidence_gap_count > 0 ? '#fbbf24' : '#10b981' }}>
                    {inv.evidence_gap_count} Gaps
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  <span>Created: {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'Recent'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={(e) => handleDelete(e, inv.id, inv.title)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  >
                    <span>Open</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
