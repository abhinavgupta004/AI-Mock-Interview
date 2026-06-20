import React from 'react';

export default function Bubble({ msg }) {
  const ai = msg.role === 'ai';
  return (
    <div className="fup" style={{
      display: 'flex',
      justifyContent: ai ? 'flex-start' : 'flex-end',
      marginBottom: 16,
      alignItems: 'flex-end',
      gap: 10,
    }}>
      {ai && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#00D4FF22,#0080FF44)',
          border: '1.5px solid #00D4FF44',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '74%',
        background: ai
          ? 'linear-gradient(135deg,#0C1A2A,#0F2035)'
          : 'linear-gradient(135deg,#0A1E3A,#0D2A50)',
        border: ai ? '1px solid #1A3050' : '1px solid #1A3A70',
        borderRadius: ai ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '11px 15px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
      }}>
        {msg.label && (
          <div className="sg" style={{
            fontSize: 9, color: '#00D4FF',
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5,
          }}>{msg.label}</div>
        )}
        <p style={{ margin: 0, color: '#C8D8E8', fontSize: 14, lineHeight: 1.7 }}>
          {msg.text}
        </p>
      </div>
      {!ai && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#0A1E3A,#1040A0)',
          border: '1.5px solid #2060C0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>👤</div>
      )}
    </div>
  );
}
