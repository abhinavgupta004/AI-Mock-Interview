import React from 'react';

const COLORS = { success: '#00c47a', error: '#ef4444', info: '#2D1B69' };

export default function Toast({ msg, type = 'success' }) {
  const c = COLORS[type] || COLORS.info;
  return (
    <div className="toast-anim" style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: '#fff',
      border: `1.5px solid #e8eaf0`,
      borderLeft: `4px solid ${c}`,
      borderRadius: 12,
      padding: '12px 18px',
      color: '#1A1A24', fontSize: 13,
      boxShadow: '0 8px 32px rgba(45,27,105,0.12)',
      maxWidth: 320, fontFamily: 'Inter, sans-serif',
    }}>
      {msg}
    </div>
  );
}
