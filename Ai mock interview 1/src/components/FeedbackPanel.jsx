import React from 'react';
import ScoreRing from './ScoreRing';
import { ROLES } from '../constants';

const CATS = [
  { key: 'technical',     label: 'Technical Accuracy', icon: '⚙️' },
  { key: 'communication', label: 'Communication',       icon: '💬' },
  { key: 'depth',         label: 'Depth & Examples',    icon: '🔍' },
  { key: 'structure',     label: 'Answer Structure',    icon: '📐' },
];

export default function FeedbackPanel({ feedback, role, level }) {
  if (!feedback) return null;
  const col = feedback.score >= 80 ? '#00c47a' : feedback.score >= 60 ? '#f59e0b' : '#ef4444';
  const robj = ROLES.find(r => r.id === role);

  return (
    <div className="fup" style={{
      background: '#fff', border: '1.5px solid #e8eaf0',
      borderRadius: 20, padding: 24, marginTop: 20,
      boxShadow: '0 4px 24px rgba(45,27,105,0.08)',
    }}>
      {/* Top accent */}
      <div style={{ height: 4, background: '#00FFA3', borderRadius: 4, marginBottom: 24 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1.5px solid #f0f1f5' }}>
        <ScoreRing score={feedback.score} />
        <div>
          <div className="sg" style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
            Interview Result
          </div>
          <div className="sg" style={{ fontSize: 22, fontWeight: 800, color: col, marginBottom: 6 }}>
            {feedback.verdict}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="sg" style={{
              fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
              background: '#2D1B69', color: '#00FFA3',
            }}>{robj?.label || role}</span>
            <span className="sg" style={{
              fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
              background: '#F8F9FA', color: '#6b7280',
            }}>{level}</span>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ marginBottom: 20 }}>
        {CATS.map(c => {
          const v = feedback[c.key] || 0;
          const bc = v >= 8 ? '#00c47a' : v >= 6 ? '#f59e0b' : '#ef4444';
          return (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{c.icon} {c.label}</span>
                <span className="sg" style={{ fontSize: 12, color: bc, fontWeight: 700 }}>{v}/10</span>
              </div>
              <div style={{ height: 6, background: '#F0F1F5', borderRadius: 4, overflow: 'hidden' }}>
                <div className="pbar" style={{
                  height: '100%', borderRadius: 4,
                  width: `${v * 10}%`,
                  background: bc,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths */}
      {feedback.strengths?.length > 0 && (
        <div style={{ marginBottom: 14, padding: 16, background: 'rgba(0,196,122,0.06)', borderRadius: 12, border: '1.5px solid rgba(0,196,122,0.2)' }}>
          <div className="sg" style={{ fontSize: 10, color: '#00c47a', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 }}>
            ✅ Strengths
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.strengths.map((t, i) => (
              <li key={i} style={{ fontSize: 13, color: '#374151', marginBottom: 4, lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {feedback.tips?.length > 0 && (
        <div style={{ padding: 16, background: '#fef9f0', borderRadius: 12, border: '1.5px solid #fde68a' }}>
          <div className="sg" style={{ fontSize: 10, color: '#d97706', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 }}>
            💡 Areas to Improve
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.tips.map((t, i) => (
              <li key={i} style={{ fontSize: 13, color: '#6b7280', marginBottom: 4, lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
