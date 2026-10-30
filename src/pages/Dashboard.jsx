import React from 'react';
import { ROLES, MAX_QUESTIONS } from '../constants';

export default function Dashboard({ sessions, user, onStart }) {
  const total = sessions.length;
  const avg = total ? Math.round(sessions.reduce((a, s) => a + (s.feedback?.score || 0), 0) / total) : 0;
  const best = total ? Math.max(...sessions.map(s => s.feedback?.score || 0)) : 0;
  const rc = sessions.reduce((a, s) => { a[s.role] = (a[s.role] || 0) + 1; return a; }, {});
  const top = Object.entries(rc).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: 'Sessions', value: total, icon: '🎤', color: '#2D1B69' },
    { label: 'Avg Score', value: avg || '—', icon: '⭐', color: '#2D1B69' },
    { label: 'Best Score', value: best || '—', icon: '🏆', color: '#2D1B69' },
    { label: 'Top Role', value: top ? ROLES.find(r => r.id === top[0])?.label.split(' ')[0] : '—', icon: '🎯', color: '#2D1B69' },
  ];

  const recent = [...sessions].reverse().slice(0, 3);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="sg" style={{ fontSize: 26, fontWeight: 800, color: '#1A1A24', marginBottom: 6 }}>
          Hey, {user.name.split(' ')[0]} 👋
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          {total === 0
            ? 'Start your first mock interview to build confidence.'
            : `You've completed ${total} interview${total > 1 ? 's' : ''} so far. Keep pushing!`}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="hlift" style={{
            background: '#fff', border: '1.5px solid #e8eaf0',
            borderRadius: 16, padding: '20px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: '#00FFA3',
            }} />
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div className="sg" style={{ fontSize: 28, fontWeight: 800, color: '#2D1B69', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: '#2D1B69',
        borderRadius: 20, padding: '28px 32px',
        marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          background: 'rgba(0,255,163,0.06)', borderRadius: '50%',
        }} />
        <div>
          <h3 className="sg" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            Ready for your next practice?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            {MAX_QUESTIONS} adaptive questions · voice interview · instant feedback
          </p>
        </div>
        <button onClick={onStart} className="pbtn sg" style={{
          background: '#00FFA3', border: 'none', borderRadius: 12,
          padding: '13px 28px', color: '#1A1A24',
          fontWeight: 800, fontSize: 14, flexShrink: 0,
        }}>
          Start Interview →
        </button>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div>
          <h3 className="sg" style={{
            fontSize: 12, color: '#9ca3af', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 14,
          }}>Recent Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(s => {
              const role = ROLES.find(r => r.id === s.role);
              const sc = s.feedback?.score || 0;
              const col = sc >= 80 ? '#00c47a' : sc >= 60 ? '#f59e0b' : '#ef4444';
              return (
                <div key={s.id} style={{
                  background: '#fff', border: '1.5px solid #e8eaf0',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: '#F8F9FA', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 20,
                  }}>{role?.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="sg" style={{ fontSize: 14, fontWeight: 700, color: '#1A1A24' }}>{role?.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.level} · {new Date(s.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="sg" style={{ fontSize: 22, fontWeight: 800, color: col }}>{sc}</div>
                    <div style={{ fontSize: 10, color: col, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {s.feedback?.verdict || '—'}
                    </div>
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
