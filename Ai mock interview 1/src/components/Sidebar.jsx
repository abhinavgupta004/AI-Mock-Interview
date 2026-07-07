import React from 'react';

const NAV = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'interview', icon: '🎤', label: 'New Interview' },
  { id: 'history',   icon: '📋', label: 'My Sessions' },
  { id: 'stats',     icon: '📊', label: 'Analytics' },
];

export default function Sidebar({ page, setPage, user, onLogout, sessions }) {
  const avg = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.feedback?.score || 0), 0) / sessions.length)
    : 0;

  return (
    <div className="sidebar-hide" style={{
      width: 230, background: '#2D1B69',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="sg" style={{
          fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            background: '#00FFA3', borderRadius: 8, width: 28, height: 28,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>🎤</span>
          InterviewAI
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="sg" style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: '#00FFA3', color: '#1A1A24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800,
          }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              {sessions.length} sessions · Avg {avg}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            className={`nav-btn${page === n.id ? ' act' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: 'none', background: 'transparent',
              color: page === n.id ? '#00FFA3' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 500, marginBottom: 2,
              borderLeft: page === n.id ? '3px solid #00FFA3' : '3px solid transparent',
              textAlign: 'left',
            }}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
          color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'left', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
        onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
          ← Sign out
        </button>
      </div>
    </div>
  );
}
