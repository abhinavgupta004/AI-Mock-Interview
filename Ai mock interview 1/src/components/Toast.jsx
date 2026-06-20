import React from 'react';

const COLORS = { success: '#34D399', error: '#F87171', info: '#00D4FF' };

export default function Toast({ msg, type = 'success' }) {
  const c = COLORS[type] || COLORS.info;
  return (
    <div className="toast-anim" style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: '#0F1E30',
      border: `1px solid ${c}44`,
      borderLeft: `3px solid ${c}`,
      borderRadius: 10,
      padding: '12px 18px',
      color: '#E2EAF4', fontSize: 13,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      maxWidth: 300,
    }}>
      {msg}
    </div>
  );
}
