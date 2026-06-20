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
      width: 220, background: '#0A1320', borderRight: '1px solid #1A2A3A',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1A2A3A' }}>
        <div className="sg" style={{
          fontSize: 18, fontWeight: 800,
          background: 'linear-gradient(90deg,#00D4FF,#60A5FA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎤 InterviewAI</div>
      </div>

      {/* User */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A2A3A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="sg" style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#0060CC,#00D4FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#E2EAF4' }}>{user.name}</div>
            <div style={{ fontSize: 10, color: '#8892A4' }}>
              {sessions.length} sessions · Avg {avg}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px' }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`nav-btn${page === n.id ? ' act' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: 'none', background: 'transparent',
              color: page === n.id ? '#00D4FF' : '#8892A4',
              fontSize: 13, fontWeight: 500, marginBottom: 2,
              borderLeft: page === n.id ? '3px solid #00D4FF' : '3px solid transparent',
              textAlign: 'left',
            }}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #1A2A3A' }}>
        <button onClick={onLogout} className="gbtn" style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: '1px solid #1A2A3A', background: 'transparent',
          color: '#8892A4', fontSize: 12, textAlign: 'left',
        }}>
          ← Sign out
        </button>
      </div>
    </div>
  );
}
