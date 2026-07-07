import React from 'react';
import { ROLES } from '../constants';

const CATS = [
  { key: 'technical',     label: 'Technical Accuracy', icon: '⚙️' },
  { key: 'communication', label: 'Communication',       icon: '💬' },
  { key: 'depth',         label: 'Depth & Examples',    icon: '🔍' },
  { key: 'structure',     label: 'Answer Structure',    icon: '📐' },
];

export default function Analytics({ sessions }) {
  if (sessions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
      <h3 className="sg" style={{ color: '#6b7280', fontSize: 18 }}>No data yet</h3>
      <p style={{ color: '#9ca3af', fontSize: 14 }}>Complete interviews to unlock your analytics.</p>
    </div>
  );

  const scores = sessions.map(s => s.feedback?.score || 0);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : 0;
  const best = Math.max(...scores);
  const catAvg = k => Math.round(sessions.reduce((a, s) => a + (s.feedback?.[k] || 0), 0) / sessions.length * 10);

  const roleDist = ROLES.map(r => {
    const rs = sessions.filter(s => s.role === r.id);
    return { ...r, count: rs.length, avg: rs.length ? Math.round(rs.reduce((a, s) => a + (s.feedback?.score || 0), 0) / rs.length) : 0 };
  }).filter(r => r.count > 0);

  const Card = ({ title, children }) => (
    <div style={{
      background: '#fff', border: '1.5px solid #e8eaf0',
      borderRadius: 18, padding: 24, marginBottom: 20,
      boxShadow: '0 2px 12px rgba(45,27,105,0.06)',
    }}>
      <div className="sg" style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18, fontWeight: 700 }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h2 className="sg" style={{ fontSize: 22, fontWeight: 800, color: '#1A1A24', marginBottom: 24 }}>Analytics</h2>

      {/* Score trend */}
      <Card title="Score Over Time">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginBottom: 16 }}>
          {scores.map((sc, i) => {
            const col = sc >= 80 ? '#00c47a' : sc >= 60 ? '#f59e0b' : '#ef4444';
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className="sg" style={{ fontSize: 10, color: col, fontWeight: 700 }}>{sc}</div>
                <div style={{
                  width: '100%', background: col, borderRadius: '6px 6px 0 0',
                  height: `${(sc / 100) * 64}px`, minHeight: 4, opacity: 0.8,
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            { label: 'Average', value: avg, color: '#2D1B69' },
            { label: 'Trend', value: (trend >= 0 ? '+' : '') + trend, color: trend >= 0 ? '#00c47a' : '#ef4444' },
            { label: 'Best', value: best, color: '#f59e0b' },
            { label: 'Sessions', value: sessions.length, color: '#2D1B69' },
          ].map(s => (
            <div key={s.label}>
              <div className="sg" style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skill breakdown */}
      <Card title="Skill Breakdown">
        {CATS.map(c => {
          const v = catAvg(c.key);
          const col = v >= 80 ? '#00c47a' : v >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <div key={c.key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{c.icon} {c.label}</span>
                <span className="sg" style={{ fontSize: 13, color: col, fontWeight: 700 }}>{v}%</span>
              </div>
              <div style={{ height: 8, background: '#F0F1F5', borderRadius: 4, overflow: 'hidden' }}>
                <div className="pbar" style={{ height: '100%', borderRadius: 4, width: `${v}%`, background: col }} />
              </div>
            </div>
          );
        })}
      </Card>

      {/* By role */}
      {roleDist.length > 0 && (
        <Card title="Performance by Role">
          {roleDist.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#1A1A24', fontWeight: 500 }}>{r.label}</span>
                  <span className="sg" style={{ fontSize: 13, color: '#2D1B69', fontWeight: 700 }}>
                    {r.avg} avg · {r.count} session{r.count > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ height: 6, background: '#F0F1F5', borderRadius: 4, overflow: 'hidden' }}>
                  <div className="pbar" style={{ height: '100%', borderRadius: 4, width: `${r.avg}%`, background: '#2D1B69' }} />
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
