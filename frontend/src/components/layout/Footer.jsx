import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Activity } from 'lucide-react';
import { setActiveView } from '../../store/uiSlice';

export default function Footer() {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state) => state.ui);

  return (
    <footer
      style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#64748b',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={15} color="#10b981" />
        <span>
          AIVOA Quality Platform • Good Manufacturing Practice (cGMP) • ICH Q9(R1) Quality Risk Management
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => dispatch(setActiveView('privacy_policy'))}
          style={{
            background: 'none',
            border: 'none',
            color: activeView === 'privacy_policy' ? '#38bdf8' : '#94a3b8',
            cursor: 'pointer',
            padding: 0,
            fontSize: '12px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = activeView === 'privacy_policy' ? '#38bdf8' : '#94a3b8')}
        >
          Privacy Policy
        </button>

        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>

        <button
          onClick={() => dispatch(setActiveView('terms_conditions'))}
          style={{
            background: 'none',
            border: 'none',
            color: activeView === 'terms_conditions' ? '#38bdf8' : '#94a3b8',
            cursor: 'pointer',
            padding: 0,
            fontSize: '12px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = activeView === 'terms_conditions' ? '#38bdf8' : '#94a3b8')}
        >
          Terms & Conditions
        </button>

        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>

        <span>Version 2.4 (GxP Production)</span>
      </div>
    </footer>
  );
}
