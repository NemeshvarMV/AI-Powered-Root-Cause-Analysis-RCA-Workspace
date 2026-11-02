import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  PlusCircle,
  FileSearch,
  FolderArchive,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import { setActiveView, toggleSidebar } from '../../store/uiSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { activeView, sidebarCollapsed } = useSelector((state) => state.ui);
  const { investigationList } = useSelector((state) => state.investigation);
  const { capaActions } = useSelector((state) => state.capa);

  const pendingCapaCount = capaActions.filter((c) => c.review_decision === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'RCA Dashboard', icon: LayoutDashboard },
    { id: 'new_investigation', label: 'New Investigation', icon: PlusCircle, badge: 'Deviation Intake' },
    { id: 'workspace', label: 'Investigation Workspace', icon: FileSearch },
    { id: 'investigations', label: 'Saved Investigations', icon: FolderArchive, count: investigationList.length },
    { id: 'capa_tracking', label: 'CAPA Tracking', icon: ShieldCheck, count: pendingCapaCount || undefined },
  ];

  return (
    <aside
      style={{
        width: sidebarCollapsed ? '72px' : '260px',
        backgroundColor: '#0f172a',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 10px rgba(2, 132, 199, 0.25)',
          }}
        >
          <Activity size={20} color="#ffffff" />
        </div>

        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                AIVOA<span style={{ color: '#38bdf8' }}>.AI</span>
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '2px 5px',
                  borderRadius: '4px',
                }}
              >
                RCA
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              Pharma Quality Workspace
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveView(item.id))}
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: '#38bdf8',
                  }}
                />
              )}

              <Icon size={19} style={{ flexShrink: 0, color: isActive ? '#38bdf8' : '#94a3b8' }} />

              {!sidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: isActive ? 600 : 500 }}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(2, 132, 199, 0.2)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#38bdf8' : '#94a3b8',
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Collapse Toggle */}
      <div
        style={{
          padding: '14px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {!sidebarCollapsed && (
          <>
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Activity size={13} color="#10b981" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>ICH Q9(R1) Aligned</span>
              </div>
              <p style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.3 }}>
                Human oversight enforced. AI findings remain proposals.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: '#64748b', paddingTop: '4px' }}>
              <button
                onClick={() => dispatch(setActiveView('privacy_policy'))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'privacy_policy' ? '#38bdf8' : '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '11px',
                  fontWeight: activeView === 'privacy_policy' ? 600 : 400,
                }}
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => dispatch(setActiveView('terms_conditions'))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'terms_conditions' ? '#38bdf8' : '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '11px',
                  fontWeight: activeView === 'terms_conditions' ? 600 : 400,
                }}
              >
                Terms
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => dispatch(toggleSidebar())}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#64748b',
            cursor: 'pointer',
          }}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!sidebarCollapsed && <span style={{ fontSize: '12px' }}>Collapse View</span>}
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
