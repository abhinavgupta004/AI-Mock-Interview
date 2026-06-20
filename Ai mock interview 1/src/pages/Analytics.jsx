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
      <h3 className="sg" style={{ color: '#8892A4', fontSize: 18 }}>No data yet</h3>
      <p style={{ color: '#4A5568', fontSize: 14 }}>Complete interviews to unlock your analytics.</p>
    </div>
  );

  const scores = sessions.map((s) => s.feedback?.score || 0);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : 0;
  const best = Math.max(...scores);
  const catAvg = (k) => Math.round(sessions.reduce((a, s) => a + (s.feedback?.[k] || 0), 0) / sessions.length * 10);

  const roleDist = ROLES.map((r) => {
    const rs = sessions.filter((s) => s.role === r.id);
    return {
      ...r,
      count: rs.length,
      avg: rs.length ? Math.round(rs.reduce((a, s) => a + (s.feedback?.score || 0), 0) / rs.length) : 0,
    };
  }).filter((r) => r.count > 0);

  const Section = ({ title, children }) => (
    <div style={{ background: '#0D1828', border: '1px solid #1A2E48', borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <div className="sg" style={{ fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h2 className="sg" style={{ fontSize: 22, fontWeight: 700, color: '#E2EAF4', marginBottom: 24 }}>Analytics</h2>

      {/* Score over time */}
      <Section title="Score Over Time">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginBottom: 12 }}>
          {scores.map((sc, i) => {
            const col = sc >= 80 ? '#34D399' : sc >= 60 ? '#F59E0B' : '#F87171';
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div className="sg" style={{ fontSize: 10, color: col }}>{sc}</div>
                <div style={{
                  width: '100%', background: col + '33',
                  borderRadius: '4px 4px 0 0',
                  height: `${(sc / 100) * 64}px`, minHeight: 4,
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          {[
            { label: 'Average', value: avg, color: '#00D4FF' },
            { label: 'Trend', value: (trend >= 0 ? '+' : '') + trend, color: trend >= 0 ? '#34D399' : '#F87171' },
            { label: 'Best', value: best, color: '#F59E0B' },
            { label: 'Sessions', value: sessions.length, color: '#A78BFA' },
          ].map((s) => (
            <div key={s.label}>
              <div className="sg" style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8892A4' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Skill breakdown */}
      <Section title="Skill Breakdown (avg %)">
        {CATS.map((c) => {
          const v = catAvg(c.key);
          const col = v >= 80 ? '#34D399' : v >= 60 ? '#F59E0B' : '#F87171';
          return (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#8892A4' }}>{c.icon} {c.label}</span>
                <span className="sg" style={{ fontSize: 13, color: col, fontWeight: 600 }}>{v}%</span>
              </div>
              <div style={{ height: 6, background: '#1A2A3A', borderRadius: 4, overflow: 'hidden' }}>
                <div className="pbar" style={{
                  height: '100%', borderRadius: 4,
                  width: `${v}%`, background: `linear-gradient(90deg,${col},${col}99)`,
                }} />
              </div>
            </div>
          );
        })}
      </Section>

      {/* By role */}
      {roleDist.length > 0 && (
        <Section title="Performance by Role">
          {roleDist.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 20, width: 28 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#C8D8E8' }}>{r.label}</span>
                  <span className="sg" style={{ fontSize: 13, color: r.color, fontWeight: 600 }}>
                    {r.avg} avg · {r.count} session{r.count > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ height: 5, background: '#1A2A3A', borderRadius: 4, overflow: 'hidden' }}>
                  <div className="pbar" style={{ height: '100%', borderRadius: 4, width: `${r.avg}%`, background: r.color }} />
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
