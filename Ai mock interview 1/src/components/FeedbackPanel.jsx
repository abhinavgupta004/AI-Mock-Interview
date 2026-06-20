import React from 'react';
import ScoreRing from './ScoreRing';
import { ROLES } from '../constants';

const CATS = [
  { key: 'technical',    label: 'Technical Accuracy', icon: '⚙️' },
  { key: 'communication',label: 'Communication',       icon: '💬' },
  { key: 'depth',        label: 'Depth & Examples',    icon: '🔍' },
  { key: 'structure',    label: 'Answer Structure',    icon: '📐' },
];

export default function FeedbackPanel({ feedback, role, level }) {
  if (!feedback) return null;

  const col = feedback.score >= 80 ? '#34D399' : feedback.score >= 60 ? '#F59E0B' : '#F87171';
  const robj = ROLES.find((r) => r.id === role);

  return (
    <div className="fup" style={{
      background: 'linear-gradient(135deg,#0A1828,#0D2038)',
      border: '1px solid #1E3A58', borderRadius: 18, padding: 24, marginTop: 20,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #1A2A3A',
      }}>
        <ScoreRing score={feedback.score} />
        <div>
          <div className="sg" style={{ fontSize: 9, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
            Interview Result
          </div>
          <div className="sg" style={{ fontSize: 22, fontWeight: 700, color: col, marginBottom: 6 }}>
            {feedback.verdict}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="sg" style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              background: (robj?.color || '#00D4FF') + '22',
              color: robj?.color || '#00D4FF',
              border: `1px solid ${(robj?.color || '#00D4FF')}44`,
            }}>{robj?.label || role}</span>
            <span className="sg" style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              background: '#A78BFA22', color: '#A78BFA', border: '1px solid #A78BFA44',
            }}>{level}</span>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ marginBottom: 20 }}>
        {CATS.map((c) => {
          const v = feedback[c.key] || 0;
          const bc = v >= 8 ? '#34D399' : v >= 6 ? '#F59E0B' : '#F87171';
          return (
            <div key={c.key} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: '#8892A4' }}>{c.icon} {c.label}</span>
                <span className="sg" style={{ fontSize: 12, color: bc, fontWeight: 600 }}>{v}/10</span>
              </div>
              <div style={{ height: 5, background: '#1A2A3A', borderRadius: 4, overflow: 'hidden' }}>
                <div className="pbar" style={{
                  height: '100%', borderRadius: 4,
                  width: `${v * 10}%`,
                  background: `linear-gradient(90deg,${bc},${bc}99)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths */}
      {feedback.strengths?.length > 0 && (
        <div style={{ marginBottom: 14, padding: 14, background: '#34D39911', borderRadius: 12, border: '1px solid #34D39933' }}>
          <div className="sg" style={{ fontSize: 10, color: '#34D399', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            ✅ Strengths
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.strengths.map((t, i) => (
              <li key={i} style={{ fontSize: 13, color: '#A8C8B8', marginBottom: 4, lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {feedback.tips?.length > 0 && (
        <div style={{ padding: 14, background: '#0B1828', borderRadius: 12, border: '1px solid #1E3050' }}>
          <div className="sg" style={{ fontSize: 10, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            💡 Areas to Improve
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.tips.map((t, i) => (
              <li key={i} style={{ fontSize: 13, color: '#8892A4', marginBottom: 4, lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
