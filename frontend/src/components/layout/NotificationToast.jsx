import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { dismissNotification } from '../../store/uiSlice';

function ToastItem({ n, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(n.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [n.id, onDismiss]);

  let Icon = Info;
  let borderColor = 'rgba(56, 189, 248, 0.4)';
  let iconColor = '#38bdf8';

  if (n.type === 'success') {
    Icon = CheckCircle2;
    borderColor = 'rgba(16, 185, 129, 0.4)';
    iconColor = '#10b981';
  } else if (n.type === 'error') {
    Icon = AlertCircle;
    borderColor = 'rgba(239, 68, 68, 0.4)';
    iconColor = '#ef4444';
  } else if (n.type === 'warning') {
    Icon = AlertTriangle;
    borderColor = 'rgba(245, 158, 11, 0.4)';
    iconColor = '#f59e0b';
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#1e293b',
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        color: '#f8fafc',
      }}
    >
      <Icon size={18} color={iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        {n.title && <div style={{ fontSize: '13px', fontWeight: 600 }}>{n.title}</div>}
        <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{n.message}</div>
      </div>
      <button
        onClick={() => onDismiss(n.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function NotificationToast() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.ui);

  const handleDismiss = useCallback(
    (id) => {
      dispatch(dismissNotification(id));
    },
    [dispatch]
  );

  if (!notifications.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        maxWidth: '400px',
      }}
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} n={n} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
