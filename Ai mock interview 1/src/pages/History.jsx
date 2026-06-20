import React, { useState } from 'react';
import FeedbackPanel from '../components/FeedbackPanel';
import { ROLES } from '../constants';

export default function History({ sessions, onClear }) {
  const [sel, setSel] = useState(null);
  const sorted = [...sessions].reverse();

  if (sorted.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h3 className="sg" style={{ color: '#8892A4', fontSize: 18, marginBottom: 8 }}>No sessions yet</h3>
      <p style={{ color: '#4A5568', fontSize: 14 }}>Complete an interview to see your history here.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="sg" style={{ fontSize: 22, fontWeight: 700, color: '#E2EAF4' }}>Session History</h2>
        <button onClick={onClear} className="gbtn" style={{
          background: 'transparent', border: '1px solid #F8717133',
          borderRadius: 8, padding: '6px 14px', color: '#F87171', fontSize: 12,
        }}>Clear All</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 1fr' : '1fr', gap: 12 }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((s) => {
            const role = ROLES.find((r) => r.id === s.role);
            const sc = s.feedback?.score || 0;
            const col = sc >= 80 ? '#34D399' : sc >= 60 ? '#F59E0B' : '#F87171';
            const isSel = sel?.id === s.id;
            return (
              <div key={s.id} onClick={() => setSel(isSel ? null : s)}
                className="hlift"
                style={{
                  background: isSel ? '#0D2038' : '#0D1828',
                  border: `1px solid ${isSel ? '#1E4A80' : '#1A2E48'}`,
                  borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                <span style={{ fontSize: 26 }}>{role?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="sg" style={{ fontSize: 14, fontWeight: 600, color: '#E2EAF4', marginBottom: 3 }}>
                    {role?.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#8892A4' }}>
                    {s.level} · {new Date(s.date).toLocaleDateString()}{' '}
                    {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="sg" style={{ fontSize: 24, fontWeight: 700, color: col }}>{sc}</div>
                  <div style={{ fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {s.feedback?.verdict || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        {sel && (
          <div style={{
            background: '#0A1828', border: '1px solid #1A3050',
            borderRadius: 14, padding: 20, maxHeight: 600, overflowY: 'auto',
          }}>
            <div className="sg" style={{
              fontSize: 12, fontWeight: 600, color: '#8892A4',
              marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1,
            }}>Session Detail</div>
            <FeedbackPanel feedback={sel.feedback} role={sel.role} level={sel.level} />
          </div>
        )}
      </div>
    </div>
  );
}
