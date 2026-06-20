import React, { useState, useRef, useEffect } from 'react';
import Bubble from '../components/Bubble';
import Waveform from '../components/Waveform';
import FeedbackPanel from '../components/FeedbackPanel';
import { callClaude } from '../utils/claude';
import { ROLES, MAX_QUESTIONS } from '../constants';

export default function InterviewRoom({ roleId, level, onComplete, onExit }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiSpeak, setAiSpeak] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [qNum, setQNum] = useState(0);
  const [hist, setHist] = useState([]);
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState('');

  const chatRef = useRef(null);
  const recRef = useRef(null);
  const role = ROLES.find((r) => r.id === roleId);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }, [msgs, feedback]);

  const addMsg = (r, text, label = '') =>
    setMsgs((p) => [...p, { role: r, text, label, id: Date.now() + Math.random() }]);

  // Start interview on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setAiSpeak(true);
      setApiError('');
      try {
        const sys = `You are a professional technical interviewer at a top tech company, hiring for ${role?.label} (${level} level).
Ask ONE question at a time. Start with a warm 1-sentence greeting then ask Question 1.
Make questions progressively harder and role-specific. Keep each response under 120 words.`;
        const text = await callClaude('Begin the interview.', sys);
        addMsg('ai', text, `Question 1 of ${MAX_QUESTIONS}`);
        setHist([{ role: 'assistant', content: text }]);
        setQNum(1);
      } catch (e) {
        setApiError('⚠️ API Error: ' + e.message + '\n\nMake sure your API key is set in src/constants.js');
      }
      setLoading(false);
      setAiSpeak(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!input.trim() || loading) return;
    const ans = input.trim();
    setInput('');
    addMsg('user', ans, 'Your Answer');
    const nh = [...hist, { role: 'user', content: ans }];
    setHist(nh);
    setLoading(true);
    setAiSpeak(true);

    const isLast = qNum >= MAX_QUESTIONS;
    const sys = `You are a professional interviewer for ${role?.label} (${level}).
${isLast
  ? "This was the LAST question. Give a warm 2-sentence closing and say 'That wraps up our interview — generating your feedback now!'"
  : `Ask question ${qNum + 1} of ${MAX_QUESTIONS}. One brief acknowledgment (1 sentence), then the question. Under 100 words total.`}`;

    const hs = nh.map((m) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n\n');

    try {
      const text = await callClaude(
        `Conversation:\n${hs}\n\n${isLast ? 'Close the interview.' : 'Ask the next question.'}`,
        sys
      );
      addMsg('ai', text, isLast ? 'Closing' : `Question ${qNum + 1} of ${MAX_QUESTIONS}`);
      const upd = [...nh, { role: 'assistant', content: text }];
      setHist(upd);
      setQNum((p) => p + 1);
      if (isLast) await genFeedback(upd);
    } catch (e) {
      setApiError('API Error: ' + e.message);
    }

    setLoading(false);
    setAiSpeak(false);
  };

  const genFeedback = async (h) => {
    setLoading(true);
    const sys = `You are an expert talent evaluator. Return ONLY valid JSON, no markdown, no extra text.`;
    const hs = h.map((m) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n\n');
    const prompt = `${role?.label} (${level}) interview:\n${hs}\n\nReturn ONLY this JSON:
{"score":<0-100>,"verdict":"<Strong Hire|Hire|No Hire|Strong No Hire>","technical":<0-10>,"communication":<0-10>,"depth":<0-10>,"structure":<0-10>,"strengths":["...","..."],"tips":["...","...","..."]}`;

    try {
      const raw = await callClaude(prompt, sys);
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setFeedback(parsed);
      setDone(true);
      onComplete({ role: roleId, level, feedback: parsed, date: Date.now(), id: Date.now() });
    } catch {
      const fb = {
        score: 70, verdict: 'Hire', technical: 7, communication: 7, depth: 6, structure: 7,
        strengths: ['Good technical understanding', 'Clear communication'],
        tips: ['Use more concrete examples', 'Explore edge cases', 'Improve complexity analysis'],
      };
      setFeedback(fb);
      setDone(true);
      onComplete({ role: roleId, level, feedback: fb, date: Date.now(), id: Date.now() });
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input requires Chrome or Edge browser.');
      return;
    }
    if (recording) { recRef.current?.stop(); setRecording(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e) => setInput(Array.from(e.results).map((r) => r[0].transcript).join(''));
    rec.onend = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 820, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 16, marginBottom: 4, borderBottom: '1px solid #1A2A3A', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{role?.icon}</span>
          <div>
            <div className="sg" style={{ fontSize: 15, fontWeight: 600, color: '#E2EAF4' }}>{role?.label}</div>
            <div style={{ fontSize: 11, color: '#8892A4' }}>{level} · {MAX_QUESTIONS} questions</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < qNum ? '#00D4FF' : '#1E3050',
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
          <button onClick={onExit} className="gbtn" style={{
            background: 'transparent', border: '1px solid #1E3050',
            borderRadius: 8, padding: '5px 12px', color: '#8892A4', fontSize: 12,
          }}>Exit</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1A2A3A', borderRadius: 4, marginBottom: 20, flexShrink: 0 }}>
        <div className="pbar" style={{
          height: '100%', borderRadius: 4,
          width: `${Math.min(qNum, MAX_QUESTIONS) / MAX_QUESTIONS * 100}%`,
          background: 'linear-gradient(90deg,#0060CC,#00D4FF)',
        }} />
      </div>

      {/* API error */}
      {apiError && (
        <div style={{
          background: '#F8717111', border: '1px solid #F8717133', borderRadius: 10,
          padding: 14, marginBottom: 16, color: '#F87171', fontSize: 13,
          whiteSpace: 'pre-wrap', flexShrink: 0,
        }}>{apiError}</div>
      )}

      {/* Chat */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}>
        {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00D4FF22,#0080FF44)',
              border: '1.5px solid #00D4FF44',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
            }}>🤖</div>
            <Waveform active={aiSpeak} />
          </div>
        )}
        {done && feedback && <FeedbackPanel feedback={feedback} role={roleId} level={level} />}
      </div>

      {/* Input */}
      {!done && (
        <div style={{ flexShrink: 0, paddingTop: 14, borderTop: '1px solid #1A2A3A', marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              disabled={loading}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
              style={{
                flex: 1, background: '#0D1828', border: '1.5px solid #1A2E48',
                borderRadius: 12, padding: '12px 15px', color: '#C8D8E8',
                fontSize: 14, lineHeight: 1.65, transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
              onBlur={(e) => (e.target.style.borderColor = '#1A2E48')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={toggleVoice}
                className={recording ? 'mic-act' : ''}
                title={recording ? 'Stop recording' : 'Voice input (Chrome/Edge)'}
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 18,
                  background: recording ? '#F8717122' : '#0D1828',
                  border: `1.5px solid ${recording ? '#F87171' : '#1A2E48'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {recording ? '⏹' : '🎙️'}
              </button>
              <button
                onClick={submit}
                disabled={loading || !input.trim()}
                className="pbtn"
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'linear-gradient(135deg,#0060CC,#00A0DC)',
                  border: 'none', color: '#fff', fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>↑</button>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#4A5568', marginTop: 7 }}>
            {recording ? '🔴 Listening… speak clearly' : 'Enter to send · 🎙️ for voice input (Chrome/Edge)'}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          flexShrink: 0, paddingTop: 16, borderTop: '1px solid #1A2A3A',
          marginTop: 8, display: 'flex', gap: 10, justifyContent: 'center',
        }}>
          <button onClick={onExit} className="pbtn sg" style={{
            background: 'linear-gradient(135deg,#0060CC,#00D4FF)',
            border: 'none', borderRadius: 12, padding: '13px 32px',
            color: '#fff', fontWeight: 700, fontSize: 14,
          }}>
            Back to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
