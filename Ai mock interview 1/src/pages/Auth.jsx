import React, { useState, useCallback } from 'react';
import store from '../utils/storage';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setErr('');
    setName('');
    setEmail('');
    setPw('');
  };

  const submit = useCallback(() => {
    setErr('');
    if (mode === 'signup' && !name.trim()) { setErr('Please enter your name.'); return; }
    if (!email.trim()) { setErr('Please enter your email.'); return; }
    if (!pw) { setErr('Please enter your password.'); return; }
    if (pw.length < 4) { setErr('Password must be at least 4 characters.'); return; }

    setLoading(true);
    setTimeout(() => {
      const users = store.get('aim_users') || {};
      if (mode === 'signup') {
        if (users[email]) { setErr('An account with this email already exists.'); setLoading(false); return; }
        users[email] = { name: name.trim() || email.split('@')[0], email, pw, joined: Date.now() };
        store.set('aim_users', users);
        onAuth(users[email]);
      } else {
        if (!users[email] || users[email].pw !== pw) {
          setErr('Incorrect email or password.'); setLoading(false); return;
        }
        onAuth(users[email]);
      }
    }, 400);
  }, [mode, name, email, pw, onAuth]);

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1829 50%, #091422 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 13px 16px;
          color: #e8eef5;
          font-size: 14.5px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: #4a5a72; }
        .auth-input:focus {
          border-color: #3b82f6;
          background: rgba(59,130,246,0.06);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .auth-input:hover:not(:focus) {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
        }
        .tab-btn {
          flex: 1; padding: 9px 8px; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
          border-radius: 8px; transition: all 0.2s; letter-spacing: 0.2px;
        }
        .tab-btn.active {
          background: #1d4ed8; color: #fff;
          box-shadow: 0 2px 8px rgba(29,78,216,0.4);
        }
        .tab-btn.inactive {
          background: transparent; color: #6b7fa0;
        }
        .tab-btn.inactive:hover { color: #94a3b8; background: rgba(255,255,255,0.05); }
        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          border: none; border-radius: 10px; color: #fff;
          font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
          box-shadow: 0 4px 14px rgba(29,78,216,0.35);
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e40af, #1d4ed8);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(29,78,216,0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .guest-btn {
          width: 100%; padding: 11px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #6b7fa0;
          font-size: 13.5px; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .guest-btn:hover {
          border-color: rgba(255,255,255,0.2);
          color: #94a3b8; background: rgba(255,255,255,0.04);
        }
        .pw-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #4a5a72;
          font-size: 13px; padding: 4px; transition: color 0.15s;
        }
        .pw-toggle:hover { color: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
          margin-right: 8px; vertical-align: middle;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400 }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 8px 24px rgba(29,78,216,0.4)',
          }}>🎤</div>
          <h1 style={{
            margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: '#e8eef5',
            letterSpacing: '-0.5px',
          }}>InterviewAI</h1>
          <p style={{ margin: 0, color: '#6b7fa0', fontSize: 14 }}>
            {mode === 'login' ? 'Good to see you again 👋' : 'Start your interview journey'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18, padding: '28px 28px 24px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>

          {/* Tab toggle */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.3)',
            borderRadius: 10, padding: 4, marginBottom: 24,
          }}>
            <button className={`tab-btn ${mode === 'login' ? 'active' : 'inactive'}`}
              onClick={() => switchMode('login')}>Sign In</button>
            <button className={`tab-btn ${mode === 'signup' ? 'active' : 'inactive'}`}
              onClick={() => switchMode('signup')}>Sign Up</button>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {mode === 'signup' && (
              <div className="fade-in">
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#6b7fa0', marginBottom: 6, letterSpacing: 0.3 }}>
                  Full Name
                </label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Abhinav Gupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKey}
                  autoFocus
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#6b7fa0', marginBottom: 6, letterSpacing: 0.3 }}>
                Email Address
              </label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                autoFocus={mode === 'login'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#6b7fa0', marginBottom: 6, letterSpacing: 0.3 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min. 4 characters' : 'Your password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyDown={handleKey}
                  style={{ paddingRight: 44 }}
                />
                <button className="pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {err && (
              <div className="fade-in" style={{
                fontSize: 13, color: '#f87171', padding: '10px 14px',
                background: 'rgba(248,113,113,0.08)', borderRadius: 8,
                border: '1px solid rgba(248,113,113,0.2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠️</span> {err}
              </div>
            )}

            <button className="submit-btn" onClick={submit} disabled={loading} style={{ marginTop: 4 }}>
              {loading
                ? <><span className="spinner" />{mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                : mode === 'login' ? 'Sign In →' : 'Create Account →'
              }
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: '#4a5a72' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <button className="guest-btn"
              onClick={() => onAuth({ name: 'Guest User', email: 'guest@aim.ai', joined: Date.now() })}>
              Continue as Guest
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#374151', fontSize: 12, marginTop: 20 }}>
          Your data stays in your browser — no servers, no tracking.
        </p>
      </div>
    </div>
  );
}
