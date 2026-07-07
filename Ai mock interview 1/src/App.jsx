import React, { useState } from 'react';
import './index.css';

import store from './utils/storage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(() => store.get('aim_user'));
  const [page, setPage] = useState('dashboard');
  const [sessions, setSessions] = useState(() => store.get('aim_sessions') || []);
  const [interview, setInterview] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAuth = (u) => { store.set('aim_user', u); setUser(u); };
  const handleLogout = () => { store.del('aim_user'); setUser(null); setSessions([]); setPage('dashboard'); };
  const handleStartInterview = (role, level) => { setInterview({ role, level }); setPage('room'); };
  const handleComplete = (session) => {
    const updated = [...sessions, session];
    setSessions(updated);
    store.set('aim_sessions', updated);
    showToast(`Interview complete! Score: ${session.feedback?.score}/100`, 'success');
  };
  const handleExit = () => { setInterview(null); setPage('dashboard'); };
  const handleClearHistory = () => { setSessions([]); store.set('aim_sessions', []); showToast('History cleared.', 'info'); };

  if (!user) return <Auth onAuth={handleAuth} />;

  const renderPage = () => {
    if (page === 'room' && interview) return (
      <InterviewRoom roleId={interview.role} level={interview.level} onComplete={handleComplete} onExit={handleExit} />
    );
    if (page === 'interview') return <InterviewSetup onStart={handleStartInterview} />;
    if (page === 'history') return <History sessions={sessions} onClear={handleClearHistory} />;
    if (page === 'stats') return <Analytics sessions={sessions} />;
    return <Dashboard sessions={sessions} user={user} onStart={() => setPage('interview')} />;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      {page !== 'room' && (
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} sessions={sessions} />
      )}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1,
          padding: page === 'room' ? '24px 28px' : '32px 36px',
          display: 'flex', flexDirection: 'column',
          height: page === 'room' ? '100vh' : 'auto',
        }}>
          {renderPage()}
        </div>
      </main>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
