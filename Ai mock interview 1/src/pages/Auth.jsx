import React, { useState } from 'react';
import store from '../utils/storage';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    setErr('');
    if (!email || !pw) { setErr('Please fill all fields.'); return; }
    if (mode === 'signup' && !name) { setErr('Enter your name.'); return; }
    if (pw.length < 4) { setErr('Password must be at least 4 characters.'); return; }

    const users = store.get('aim_users') || {};

    if (mode === 'signup') {
      if (users[email]) { setErr('Account already exists. Please sign in.'); return; }
      users[email] = { name: name || email.split('@')[0], email, pw, joined: Date.now() };
      store.set('aim_users', users);
      onAuth(users[email]);
    } else {
      if (!users[email] || users[email].pw !== pw) {
        setErr('Invalid email or password.');
        return;
      }
      onAuth(users[email]);
    }
  };

  const Field = ({ placeholder, value, set, type = 'text' }) => (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={(e) => set(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && submit()}
      style={{
        width: '100%', background: '#0D1828',
        border: '1.5px solid #1E3050', borderRadius: 10,
        padding: '12px 16px', color: '#E2EAF4', fontSize: 14,
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
      onBlur={(e) => (e.target.style.borderColor = '#1E3050')}
    />
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#080E1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎤</div>
          <h1 className="sg" style={{
            fontSize: 32, fontWeight: 800,
            background: 'linear-gradient(90deg,#00D4FF,#60A5FA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px', marginBottom: 6,
          }}>InterviewAI</h1>
          <p style={{ color: '#8892A4', fontSize: 14 }}>
            {mode === 'login' ? 'Welcome back — let\'s practice' : 'Create your free account'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#0D1828', border: '1px solid #1A2E48',
          borderRadius: 18, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Tab toggle */}
          <div style={{ display: 'flex', marginBottom: 28, background: '#0A1520', borderRadius: 10, padding: 4 }}>
            {['login', 'signup'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setErr(''); }}
                style={{
                  flex: 1, padding: 8, borderRadius: 8, border: 'none',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: mode === m ? 'linear-gradient(135deg,#0060CC,#00A0DC)' : 'transparent',
                  color: mode === m ? '#fff' : '#8892A4',
                }} className="sg">
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <Field placeholder="Full Name" value={name} set={setName} />
            )}
            <Field placeholder="Email address" value={email} set={setEmail} type="email" />
            <Field placeholder="Password" value={pw} set={setPw} type="password" />

            {err && (
              <div style={{
                fontSize: 12, color: '#F87171', padding: '8px 12px',
                background: '#F8717111', borderRadius: 8, border: '1px solid #F8717133',
              }}>{err}</div>
            )}

            <button className="pbtn sg" onClick={submit} style={{
              background: 'linear-gradient(135deg,#0060CC,#00D4FF)',
              border: 'none', borderRadius: 10, padding: 14,
              color: '#fff', fontWeight: 700, fontSize: 15, marginTop: 4,
            }}>
              {mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>

            <button
              onClick={() => onAuth({ name: 'Demo User', email: 'demo@aim.ai', joined: Date.now() })}
              style={{
                background: 'transparent', border: '1px solid #1E3050',
                borderRadius: 10, padding: 10, color: '#8892A4', fontSize: 13,
              }} className="gbtn">
              Continue as Guest (Demo)
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#4A5568', fontSize: 11, marginTop: 20 }}>
          All data stays in your browser · No server required
        </p>
      </div>
    </div>
  );
}
