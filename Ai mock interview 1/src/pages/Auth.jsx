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
    if (mode === 'signup' && !name.trim()) { setErr('Hey, what should we call you?'); return; }
    if (!email.trim()) { setErr('Need your email to continue.'); return; }
    if (!pw) { setErr("Don't forget your password."); return; }
    if (pw.length < 4) { setErr('Password should be at least 4 characters.'); return; }

    setLoading(true);
    setTimeout(() => {
      const users = store.get('aim_users') || {};
      if (mode === 'signup') {
        if (users[email]) { setErr('Looks like you already have an account — try signing in instead.'); setLoading(false); return; }
        users[email] = { name: name.trim() || email.split('@')[0], email, pw, joined: Date.now() };
        store.set('aim_users', users);
        onAuth(users[email]);
      } else {
        if (!users[email] || users[email].pw !== pw) {
          setErr("That email/password combo doesn't look right."); setLoading(false); return;
        }
        onAuth(users[email]);
      }
    }, 350);
  }, [mode, name, email, pw, onAuth]);

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f5f2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@600&display=swap');
        * { box-sizing: border-box; }

        .grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
        }

        .blob {
          position: absolute; border-radius: 50%; filter: blur(60px);
          opacity: 0.35; pointer-events: none;
        }
        .blob1 { width: 320px; height: 320px; background: #ffd9a0; top: -80px; left: -100px; }
        .blob2 { width: 280px; height: 280px; background: #b8d4ff; bottom: -100px; right: -80px; }

        .auth-input {
          width: 100%;
          background: #fffdfa;
          border: 2px solid #2b2b2b;
          border-radius: 8px;
          padding: 12px 15px;
          color: #2b2b2b;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: transform 0.12s, box-shadow 0.12s;
          box-shadow: 3px 3px 0 #2b2b2b;
        }
        .auth-input::placeholder { color: #a8a29a; }
        .auth-input:focus {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 #ff6b4a;
        }
        .auth-input:hover:not(:focus) {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 #2b2b2b;
        }

        .tab-row {
          display: flex; gap: 8px; margin-bottom: 22px;
        }
        .tab-btn {
          flex: 1; padding: 10px 8px; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
          border-radius: 8px; transition: all 0.15s; letter-spacing: 0.2px;
          border: 2px solid #2b2b2b;
        }
        .tab-btn.active {
          background: #ffd9a0; color: #2b2b2b;
          box-shadow: 3px 3px 0 #2b2b2b;
          transform: translate(-1px, -1px);
        }
        .tab-btn.inactive {
          background: #fffdfa; color: #8a8378;
          box-shadow: none;
        }
        .tab-btn.inactive:hover { background: #f3f0ea; color: #2b2b2b; }

        .submit-btn {
          width: 100%; padding: 13px;
          background: #2b2b2b;
          border: 2px solid #2b2b2b; border-radius: 8px; color: #fffdfa;
          font-size: 15.5px; font-weight: 700; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.12s; letter-spacing: 0.2px;
          box-shadow: 4px 4px 0 #ff6b4a;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #ff6b4a;
        }
        .submit-btn:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 2px 2px 0 #ff6b4a;
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .guest-btn {
          width: 100%; padding: 11px;
          background: transparent;
          border: 2px dashed #c4bdb0;
          border-radius: 8px; color: #6b6457;
          font-size: 13.5px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.15s;
        }
        .guest-btn:hover {
          border-color: #2b2b2b; color: #2b2b2b; background: #f3f0ea;
        }

        .pw-toggle {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #a8a29a;
          font-size: 13px; padding: 4px; transition: color 0.15s;
        }
        .pw-toggle:hover { color: #2b2b2b; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .mic-wiggle { display: inline-block; animation: wiggle 2.5s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.6s linear infinite; display: inline-block;
          margin-right: 8px; vertical-align: middle;
        }

        .handwritten {
          font-family: 'Caveat', cursive;
          font-size: 19px;
          color: #ff6b4a;
          transform: rotate(-2deg);
          display: inline-block;
        }
      `}</style>

      <div className="grain" />
      <div className="blob blob1" />
      <div className="blob blob2" />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative' }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>
            <span className="mic-wiggle">🎤</span>
          </div>
          <h1 style={{
            margin: '0 0 4px', fontSize: 27, fontWeight: 800, color: '#2b2b2b',
            letterSpacing: '-0.5px',
          }}>InterviewAI</h1>
          <p className="handwritten">
            {mode === 'login' ? 'good to see you again!' : "let's get you set up"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fffdfa',
          border: '2.5px solid #2b2b2b',
          borderRadius: 16, padding: '26px 24px 22px',
          boxShadow: '8px 8px 0 #2b2b2b',
        }}>

          {/* Tab toggle */}
          <div className="tab-row">
            <button className={`tab-btn ${mode === 'login' ? 'active' : 'inactive'}`}
              onClick={() => switchMode('login')}>Sign In</button>
            <button className={`tab-btn ${mode === 'signup' ? 'active' : 'inactive'}`}
              onClick={() => switchMode('signup')}>Sign Up</button>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {mode === 'signup' && (
              <div className="fade-in">
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#6b6457', marginBottom: 6 }}>
                  What's your name?
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
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#6b6457', marginBottom: 6 }}>
                Email
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
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#6b6457', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'at least 4 characters' : 'your password'}
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
                fontSize: 13, color: '#9a3412', padding: '10px 13px',
                background: '#fef0e8', borderRadius: 8,
                border: '2px solid #f4a582',
              }}>
                {err}
              </div>
            )}

            <button className="submit-btn" onClick={submit} disabled={loading} style={{ marginTop: 6 }}>
              {loading
                ? <><span className="spinner" />{mode === 'login' ? 'one sec...' : 'setting things up...'}</>
                : mode === 'login' ? "Let's go →" : 'Create my account →'
              }
            </button>

            <div style={{ textAlign: 'center', margin: '4px 0', color: '#c4bdb0', fontSize: 12, fontWeight: 600 }}>
              — or —
            </div>

            <button className="guest-btn"
              onClick={() => onAuth({ name: 'Guest User', email: 'guest@aim.ai', joined: Date.now() })}>
              Just let me try it (Guest)
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#a8a29a', fontSize: 12, marginTop: 18 }}>
          Everything stays on your device. Nothing leaves your browser.
        </p>
      </div>
    </div>
  );
}
