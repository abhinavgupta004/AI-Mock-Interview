import React, { useState } from 'react';
import { ROLES, LEVELS, MAX_QUESTIONS } from '../constants';

export default function InterviewSetup({ onStart }) {
  const [role, setRole] = useState(null);
  const [level, setLevel] = useState('Mid-level');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 30 }}>
        <h2 className="sg" style={{ fontSize: 24, fontWeight: 700, color: '#E2EAF4', marginBottom: 6 }}>
          New Interview
        </h2>
        <p style={{ color: '#8892A4', fontSize: 14 }}>
          Pick a role and level. The AI will ask {MAX_QUESTIONS} tailored questions.
        </p>
      </div>

      {/* Role grid */}
      <div style={{ marginBottom: 28 }}>
        <div className="sg" style={{
          fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14,
        }}>Select Role</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className={`rcard${role === r.id ? ' sel' : ''}`}
              style={{
                background: role === r.id ? r.color + '20' : '#0D1828',
                border: `1.5px solid ${role === r.id ? r.color : '#1A2E48'}`,
                borderRadius: 12, padding: '14px 16px', textAlign: 'left', color: '#E2EAF4',
              }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
              <div className="sg" style={{ fontSize: 13, fontWeight: 600, color: role === r.id ? r.color : '#C8D8E8', marginBottom: 6 }}>
                {r.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.tags.slice(0, 2).map((t) => (
                  <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 20, background: '#1A2A3A', color: '#8892A4' }}>
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div style={{ marginBottom: 36 }}>
        <div className="sg" style={{
          fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14,
        }}>Experience Level</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} className="gbtn sg" style={{
              background: level === l ? '#00D4FF18' : '#0D1828',
              border: `1.5px solid ${level === l ? '#00D4FF' : '#1A2E48'}`,
              borderRadius: 8, padding: '8px 18px',
              color: level === l ? '#00D4FF' : '#8892A4',
              fontSize: 13, fontWeight: 500,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <button
        onClick={() => role && onStart(role, level)}
        disabled={!role}
        className="pbtn sg"
        style={{
          width: '100%',
          background: role ? 'linear-gradient(135deg,#0060CC,#00D4FF)' : '#1A2A3A',
          border: 'none', borderRadius: 14, padding: 17,
          color: '#fff', fontWeight: 700, fontSize: 16,
        }}>
        {role
          ? `Begin ${ROLES.find((r) => r.id === role)?.label} Interview →`
          : 'Select a role to continue'}
      </button>
    </div>
  );
}
