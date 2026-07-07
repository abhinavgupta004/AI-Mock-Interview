import React, { useState } from 'react';
import { ROLES, LEVELS, MAX_QUESTIONS } from '../constants';

export default function InterviewSetup({ onStart }) {
  const [role, setRole] = useState(null);
  const [level, setLevel] = useState('Mid-level');

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 className="sg" style={{ fontSize: 24, fontWeight: 800, color: '#1A1A24', marginBottom: 6 }}>
          New Interview
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Pick your role and level — AI will ask {MAX_QUESTIONS} tailored questions including coding.
        </p>
      </div>

      {/* Roles */}
      <div style={{ marginBottom: 30 }}>
        <div className="sg" style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
          Select Role
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(165px,1fr))', gap: 10 }}>
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className="rcard"
              style={{
                background: role === r.id ? '#2D1B69' : '#fff',
                border: `2px solid ${role === r.id ? '#2D1B69' : '#e8eaf0'}`,
                borderRadius: 14, padding: '16px 16px', textAlign: 'left',
                position: 'relative', overflow: 'hidden',
              }}>
              {role === r.id && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: '#00FFA3',
                }} />
              )}
              <div style={{ fontSize: 26, marginBottom: 8 }}>{r.icon}</div>
              <div className="sg" style={{
                fontSize: 13, fontWeight: 700, marginBottom: 6,
                color: role === r.id ? '#fff' : '#1A1A24',
              }}>{r.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.tags.slice(0, 2).map(t => (
                  <span key={t} style={{
                    fontSize: 9, padding: '2px 7px', borderRadius: 20, fontWeight: 600,
                    background: role === r.id ? 'rgba(0,255,163,0.15)' : '#F8F9FA',
                    color: role === r.id ? '#00FFA3' : '#9ca3af',
                  }}>{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div style={{ marginBottom: 36 }}>
        <div className="sg" style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
          Experience Level
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{
              background: level === l ? '#2D1B69' : '#fff',
              border: `2px solid ${level === l ? '#2D1B69' : '#e8eaf0'}`,
              borderRadius: 10, padding: '9px 20px',
              color: level === l ? '#fff' : '#6b7280',
              fontSize: 13, fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => role && onStart(role, level)} disabled={!role}
        className="pbtn sg" style={{
          width: '100%',
          background: role ? '#00FFA3' : '#e8eaf0',
          border: 'none', borderRadius: 14, padding: 17,
          color: role ? '#1A1A24' : '#9ca3af',
          fontWeight: 800, fontSize: 16, letterSpacing: '-0.2px',
        }}>
        {role ? `Begin ${ROLES.find(r => r.id === role)?.label} Interview →` : 'Select a role to continue'}
      </button>
    </div>
  );
}
