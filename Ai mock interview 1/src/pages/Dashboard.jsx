import React from 'react';
import { ROLES, MAX_QUESTIONS } from '../constants';

export default function Dashboard({ sessions, user, onStart }) {
  const total = sessions.length;
  const avg = total
    ? Math.round(sessions.reduce((a, s) => a + (s.feedback?.score || 0), 0) / total)
    : 0;
  const best = total ? Math.max(...sessions.map((s) => s.feedback?.score || 0)) : 0;
  const rc = sessions.reduce((a, s) => { a[s.role] = (a[s.role] || 0) + 1; return a; }, {});
  const top = Object.entries(rc).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: 'Sessions',   value: total,                                                   icon: '🎤', color: '#00D4FF' },
    { label: 'Avg Score',  value: avg || '—',                                              icon: '⭐', color: '#F59E0B' },
    { label: 'Best Score', value: best || '—',                                             icon: '🏆', color: '#34D399' },
    { label: 'Top Role',   value: top ? ROLES.find((r) => r.id === top[0])?.label.split(' ')[0] : '—', icon: '🎯', color: '#A78BFA' },
  ];

  const recent = [...sessions].reverse().slice(0, 3);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 className="sg" style={{ fontSize: 26, fontWeight: 700, color: '#E2EAF4', marginBottom: 6 }}>
          Hey, {user.name.split(' ')[0]} 👋
        </h2>
        <p style={{ color: '#8892A4', fontSize: 14 }}>
          {total === 0
            ? 'Start your first mock interview to build confidence.'
            : `You've completed ${total} interview${total > 1 ? 's' : ''} so far. Keep pushing!`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="hlift" style={{
            background: '#0D1828', border: '1px solid #1A2E48', borderRadius: 14, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div className="sg" style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg,#0A1E38,#0D2548)',
        border: '1px solid #1E3A60', borderRadius: 18, padding: '28px 30px',
        marginBottom: 32, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
      }}>
        <div>
          <h3 className="sg" style={{ fontSize: 20, fontWeight: 700, color: '#E2EAF4', marginBottom: 6 }}>
            Ready for your next practice?
          </h3>
          <p style={{ color: '#8892A4', fontSize: 13 }}>
            Choose a role and challenge yourself with {MAX_QUESTIONS} tailored questions.
          </p>
        </div>
        <button onClick={onStart} className="pbtn sg" style={{
          background: 'linear-gradient(135deg,#0060CC,#00D4FF)',
          border: 'none', borderRadius: 12, padding: '14px 28px',
          color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
        }}>
          Start Interview →
        </button>
      </div>

      {/* Recent sessions */}
      {recent.length > 0 && (
        <div>
          <h3 className="sg" style={{
            fontSize: 13, color: '#8892A4', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 14,
          }}>Recent Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((s) => {
              const role = ROLES.find((r) => r.id === s.role);
              const sc = s.feedback?.score || 0;
              const col = sc >= 80 ? '#34D399' : sc >= 60 ? '#F59E0B' : '#F87171';
              return (
                <div key={s.id} style={{
                  background: '#0D1828', border: '1px solid #1A2E48',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 22 }}>{role?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="sg" style={{ fontSize: 14, fontWeight: 600, color: '#E2EAF4' }}>
                      {role?.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#8892A4' }}>
                      {s.level} · {new Date(s.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sg" style={{ fontSize: 20, fontWeight: 700, color: col }}>{sc}</div>
                    <div style={{ fontSize: 10, color: col }}>{s.feedback?.verdict || '—'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
