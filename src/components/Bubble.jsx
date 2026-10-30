import React from 'react';

export default function Bubble({ msg }) {
  const ai = msg.role === 'ai';
  return (
    <div className="fup" style={{
      display: 'flex', justifyContent: ai ? 'flex-start' : 'flex-end',
      marginBottom: 16, alignItems: 'flex-end', gap: 10,
    }}>
      {ai && (
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: '#2D1B69',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '74%',
        background: ai ? '#2D1B69' : '#fff',
        border: ai ? 'none' : '1.5px solid #e8eaf0',
        borderRadius: ai ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        padding: '12px 16px',
        boxShadow: ai ? '0 4px 16px rgba(45,27,105,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {msg.label && (
          <div className="sg" style={{
            fontSize: 9, color: ai ? '#00FFA3' : '#9ca3af',
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5, fontWeight: 700,
          }}>{msg.label}</div>
        )}
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.7,
          color: ai ? 'rgba(255,255,255,0.9)' : '#1A1A24',
        }}>{msg.text}</p>
      </div>
      {!ai && (
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: '#00FFA3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>👤</div>
      )}
    </div>
  );
}
