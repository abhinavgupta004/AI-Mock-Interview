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
    if (mode === 'signup' && !name.trim()) { setErr('what should we call you?'); return; }
    if (!email.trim()) { setErr('need an email to continue'); return; }
    if (!pw) { setErr("password's missing"); return; }
    if (pw.length < 4) { setErr('needs to be at least 4 characters'); return; }

    setLoading(true);
    setTimeout(() => {
      const users = store.get('aim_users') || {};
      if (mode === 'signup') {
        if (users[email]) { setErr('that email is already registered — try signing in'); setLoading(false); return; }
        users[email] = { name: name.trim() || email.split('@')[0], email, pw, joined: Date.now() };
        store.set('aim_users', users);
        onAuth(users[email]);
      } else {
        if (!users[email] || users[email].pw !== pw) {
          setErr("hmm, that didn't match anything"); setLoading(false); return;
        }
        onAuth(users[email]);
      }
    }, 320);
  }, [mode, name, email, pw, onAuth]);

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', fontFamily: "Georgia, 'Times New Roman', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }

        .auth-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #d4d0c8;
          border-radius: 0;
          padding: 9px 2px 9px 0;
          color: #2c2a26;
          font-size: 15.5px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .auth-input::placeholder { color: #b8b2a6; font-style: italic; }
        .auth-input:focus { border-bottom-color: #c9622f; }
        .auth-input:hover:not(:focus) { border-bottom-color: #a8a296; }

        .tab-link {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          padding: 0 0 4px; color: #b8b2a6; position: relative;
          transition: color 0.2s;
        }
        .tab-link.active { color: #2c2a26; }
        .tab-link.active::after {
          content: ''; position: absolute; left: -2px; right: -2px; bottom: -1px;
          height: 2px; background: #c9622f;
          border-radius: 2px;
        }
        .tab-link:hover:not(.active) { color: #6b6457; }

        .submit-btn {
          width: 100%; padding: 12px 14px;
          background: #2c2a26;
          border: none; border-radius: 6px; color: #fdfcfa;
          font-size: 14.5px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .submit-btn:hover:not(:disabled) { background: #c9622f; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .guest-link {
          background: none; border: none; cursor: pointer;
          color: #8a8378; font-size: 13px; font-family: 'Inter', sans-serif;
          text-decoration: underline; text-decoration-color: #d4d0c8;
          text-underline-offset: 3px; padding: 4px;
          transition: color 0.15s;
        }
        .guest-link:hover { color: #2c2a26; text-decoration-color: #c9622f; }

        .pw-toggle {
          position: absolute; right: 0; top: 9px;
          background: none; border: none; cursor: pointer; color: #b8b2a6;
          font-size: 12px; padding: 2px 4px;
        }
        .pw-toggle:hover { color: #6b6457; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.2s ease forwards; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.6s linear infinite; display: inline-block;
          margin-right: 7px; vertical-align: middle;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 360 }} className="fade-in">

        {/* Header — slightly left-leaning, not perfectly centered */}
        <div style={{ marginBottom: 36, paddingLeft: 2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🎤</span>
            <h1 style={{
              margin: 0, fontSize: 22, fontWeight: 700, color: '#2c2a26',
              fontFamily: "'Inter', sans-serif", letterSpacing: '-0.3px',
            }}>InterviewAI</h1>
          </div>
          <p style={{
            margin: '2px 0 0 31px', color: '#8a8378', fontSize: 13.5,
            fontFamily: "'Inter', sans-serif",
          }}>
            {mode === 'login' ? "let's pick up where you left off" : 'takes about 20 seconds'}
          </p>
        </div>

        {/* Tabs — text links, not boxed */}
        <div style={{ display: 'flex', gap: 22, marginBottom: 26, paddingLeft: 2 }}>
          <button className={`tab-link ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}>Sign in</button>
          <button className={`tab-link ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}>Create account</button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingLeft: 2 }}>

          {mode === 'signup' && (
            <div className="fade-in">
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#a8a296', marginBottom: 5, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Name
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder="how should we address you"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#a8a296', marginBottom: 5, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#a8a296', marginBottom: 5, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="auth-input"
                type={showPw ? 'text' : 'password'}
                placeholder={mode === 'signup' ? '4+ characters works' : '••••••••'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={handleKey}
                style={{ paddingRight: 40 }}
              />
              <button className="pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                {showPw ? 'hide' : 'show'}
              </button>
            </div>
          </div>

          {err && (
            <div className="fade-in" style={{
              fontSize: 13, color: '#c9622f', fontFamily: "'Inter', sans-serif",
              fontStyle: 'italic',
            }}>
              — {err}
            </div>
          )}

          <button className="submit-btn" onClick={submit} disabled={loading} style={{ marginTop: 6 }}>
            {loading
              ? <><span className="spinner" />{mode === 'login' ? 'checking...' : 'setting up...'}</>
              : mode === 'login' ? 'Sign in' : 'Create account'
            }
          </button>

          <div style={{ textAlign: 'center', marginTop: 2 }}>
            <button className="guest-link"
              onClick={() => onAuth({ name: 'Guest User', email: 'guest@aim.ai', joined: Date.now() })}>
              or just try it without an account
            </button>
          </div>
        </div>

        <p style={{
          color: '#c4bfb4', fontSize: 11.5, marginTop: 34, paddingLeft: 2,
          fontFamily: "'Inter', sans-serif", lineHeight: 1.5,
        }}>
          Built as a personal project — your data stays in this browser, nothing gets sent anywhere.
        </p>
      </div>
    </div>
  );
}
