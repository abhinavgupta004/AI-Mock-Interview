import React, { useState } from 'react';
import FeedbackPanel from '../components/FeedbackPanel';
import { ROLES } from '../constants';

export default function History({ sessions, onClear }) {
  const [sel, setSel] = useState(null);
  const sorted = [...sessions].reverse();

  if (sorted.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h3 className="sg" style={{ color: '#6b7280', fontSize: 18, marginBottom: 8 }}>No sessions yet</h3>
      <p style={{ color: '#9ca3af', fontSize: 14 }}>Complete an interview to see your history here.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="sg" style={{ fontSize: 22, fontWeight: 800, color: '#1A1A24' }}>Session History</h2>
        <button onClick={onClear} style={{
          background: 'transparent', border: '1.5px solid #fca5a5',
          borderRadius: 8, padding: '6px 14px', color: '#ef4444',
          fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          transition: 'all 0.15s',
        }}>Clear All</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 1fr' : '1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(s => {
            const role = ROLES.find(r => r.id === s.role);
            const sc = s.feedback?.score || 0;
            const col = sc >= 80 ? '#00c47a' : sc >= 60 ? '#f59e0b' : '#ef4444';
            const isSel = sel?.id === s.id;
            return (
              <div key={s.id} onClick={() => setSel(isSel ? null : s)}
                className="hlift"
                style={{
                  background: isSel ? '#2D1B69' : '#fff',
                  border: `1.5px solid ${isSel ? '#2D1B69' : '#e8eaf0'}`,
                  borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: isSel ? 'rgba(0,255,163,0.15)' : '#F8F9FA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{role?.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="sg" style={{ fontSize: 14, fontWeight: 700, color: isSel ? '#fff' : '#1A1A24', marginBottom: 3 }}>
                    {role?.label}
                  </div>
                  <div style={{ fontSize: 11, color: isSel ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}>
                    {s.level} · {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="sg" style={{ fontSize: 24, fontWeight: 800, color: isSel ? '#00FFA3' : col }}>{sc}</div>
                  <div style={{ fontSize: 10, color: isSel ? '#00FFA3' : col, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {s.feedback?.verdict || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sel && (
          <div style={{
            background: '#fff', border: '1.5px solid #e8eaf0',
            borderRadius: 16, padding: 20, maxHeight: 600, overflowY: 'auto',
          }}>
            <div className="sg" style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
              Session Detail
            </div>
            <FeedbackPanel feedback={sel.feedback} role={sel.role} level={sel.level} />
          </div>
        )}
      </div>
    </div>
  );
}
