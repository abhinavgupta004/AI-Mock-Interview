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

  const switchMode = (m) => { setMode(m); setErr(''); setName(''); setEmail(''); setPw(''); };

  const submit = useCallback(() => {
    setErr('');
    if (mode === 'signup' && !name.trim()) { setErr('What should we call you?'); return; }
    if (!email.trim()) { setErr('Need your email to continue.'); return; }
    if (!pw) { setErr("Don't forget your password."); return; }
    if (pw.length < 4) { setErr('Password needs at least 4 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      const users = store.get('aim_users') || {};
      if (mode === 'signup') {
        if (users[email]) { setErr('Account already exists — try signing in.'); setLoading(false); return; }
        users[email] = { name: name.trim() || email.split('@')[0], email, pw, joined: Date.now() };
        store.set('aim_users', users);
        onAuth(users[email]);
      } else {
        if (!users[email] || users[email].pw !== pw) { setErr("That doesn't match — try again."); setLoading(false); return; }
        onAuth(users[email]);
      }
    }, 350);
  }, [mode, name, email, pw, onAuth]);

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2D1B69 0%, #1a0f42 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        .auth-input {
          width: 100%;
          background: #F8F9FA;
          border: 2px solid #e2e4ea;
          border-radius: 10px;
          padding: 13px 16px;
          color: #1A1A24;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input::placeholder { color: #9ca3af; }
        .auth-input:focus {
          border-color: #00FFA3;
          box-shadow: 0 0 0 3px rgba(0,255,163,0.15);
        }

        .tab-btn {
          flex: 1; padding: 10px 8px; border: none; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 700;
          border-radius: 8px; transition: all 0.2s;
        }
        .tab-btn.active { background: #00FFA3; color: #1A1A24; }
        .tab-btn.inactive { background: transparent; color: rgba(255,255,255,0.5); }
        .tab-btn.inactive:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.06); }

        .submit-btn {
          width: 100%; padding: 14px;
          background: #00FFA3;
          border: none; border-radius: 10px;
          color: #1A1A24; font-size: 15px; font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,255,163,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(0,255,163,0.45);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .guest-btn {
          width: 100%; padding: 12px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 10px; color: rgba(255,255,255,0.6);
          font-size: 13.5px; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .guest-btn:hover { border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(255,255,255,0.05); }

        .pw-toggle {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 12px; padding: 4px;
          font-family: 'Inter', sans-serif; transition: color 0.15s;
        }
        .pw-toggle:hover { color: #1A1A24; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(26,26,36,0.3);
          border-top-color: #1A1A24; border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block; margin-right: 8px; vertical-align: middle;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400 }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
            background: '#00FFA3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, boxShadow: '0 8px 28px rgba(0,255,163,0.4)',
          }}>🎤</div>
          <h1 style={{
            margin: '0 0 6px', fontSize: 28, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.5px',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>InterviewAI</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Create your free account'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#2D1B69',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '28px 26px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.25)',
            borderRadius: 10, padding: 4, marginBottom: 24, gap: 4,
          }}>
            {['login','signup'].map(m => (
              <button key={m}
                className={`tab-btn ${mode === m ? 'active' : 'inactive'}`}
                onClick={() => switchMode(m)}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div className="fade-in">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Name</label>
                <input className="auth-input" type="text" placeholder="Your full name"
                  value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} autoFocus />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Email</label>
              <input className="auth-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
                autoFocus={mode === 'login'} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="auth-input" type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min. 4 characters' : '••••••••'}
                  value={pw} onChange={e => setPw(e.target.value)} onKeyDown={handleKey}
                  style={{ paddingRight: 52 }} />
                <button className="pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {err && (
              <div className="fade-in" style={{
                fontSize: 13, color: '#ff6b6b', padding: '10px 13px',
                background: 'rgba(255,107,107,0.1)', borderRadius: 8,
                border: '1px solid rgba(255,107,107,0.25)',
              }}> {err}</div>
            )}

            <button className="submit-btn" onClick={submit} disabled={loading} style={{ marginTop: 6 }}>
              {loading
                ? <><span className="spinner" />{mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <button className="guest-btn"
              onClick={() => onAuth({ name: 'Guest User', email: 'guest@aim.ai', joined: Date.now() })}>
              Continue as Guest 
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 20 }}>
          Your data stays in your browser — nothing leaves your device.
        </p>
      </div>
    </div>
  );
}
