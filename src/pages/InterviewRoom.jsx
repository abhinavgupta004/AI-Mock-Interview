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
  const [voiceMode, setVoiceMode] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [started, setStarted] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState('');

  const chatRef = useRef(null);
  const recRef = useRef(null);
  const utterRef = useRef(null);
  const role = ROLES.find((r) => r.id === roleId);

  const ttsSupported = 'speechSynthesis' in window;
  const sttSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }, [msgs, feedback]);

  useEffect(() => {
    if (!ttsSupported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => { if (ttsSupported) window.speechSynthesis.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMsg = (r, text, label = '') =>
    setMsgs((p) => [...p, { role: r, text, label, id: Date.now() + Math.random() }]);

  const pickVoice = () => {
    const allVoices = window.speechSynthesis.getVoices();
    return (
      allVoices.find(v => v.name.includes('Google US English')) ||
      allVoices.find(v => v.name.includes('Google UK English Female')) ||
      allVoices.find(v => /en-US/.test(v.lang) && v.localService === false) ||
      allVoices.find(v => /en-US/.test(v.lang)) ||
      allVoices.find(v => v.lang.startsWith('en')) ||
      allVoices[0]
    );
  };

  const speak = (text) => {
    if (!ttsSupported || !voiceMode) return;

    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`]/g, '').trim();
    if (!clean) return;

    const trySpeak = () => {
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.volume = 1;

      const preferred = pickVoice();
      if (preferred) utter.voice = preferred;

      utter.onstart = () => setSpeaking(true);
      utter.onend = () => {
        setSpeaking(false);
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      };
      utter.onerror = (e) => {
        console.warn('Speech error:', e.error);
        setSpeaking(false);
      };

      utterRef.current = utter;
      window.speechSynthesis.speak(utter);

      // Chrome long-text bug fix
      const resumeInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(resumeInterval);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      setTimeout(trySpeak, 150);
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        setTimeout(trySpeak, 150);
      }, { once: true });
    }
  };

  const unlockSpeech = () => {
    if (!ttsSupported) return;

    const v = window.speechSynthesis.getVoices();
    if (v.length) setVoices(v);

    const warm = new SpeechSynthesisUtterance(' ');
    warm.volume = 0.01;
    warm.rate = 2;
    window.speechSynthesis.speak(warm);

    setTimeout(() => {
      window.speechSynthesis.cancel();
      setVoices(window.speechSynthesis.getVoices());
    }, 300);
  };

  const stopSpeaking = () => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // Q1 — pehle skills poochho
  useEffect(() => {
    if (!started) return;
    (async () => {
      setLoading(true);
      setAiSpeak(true);
      setApiError('');
      try {
        const sys = `You are a professional technical interviewer at a top tech company interviewing for ${role?.label} (${level} level).
This is the opening of the interview. Give a brief warm greeting (1 sentence), then ask the candidate to describe their key skills, technologies, frameworks, and tools they are most comfortable with — relevant to the ${role?.label} role.
Keep it conversational, under 80 words. No markdown, no bullet points — speak naturally as if in a real interview.`;
        const text = await callClaude('Start the interview — ask about skills.', sys);
        addMsg('ai', text, 'Question 1 of 10 — Skills');
        setHist([{ role: 'assistant', content: text }]);
        setQNum(1);
        speak(text);
      } catch (e) {
        setApiError('⚠️ API Error: ' + e.message);
      }
      setLoading(false);
      setAiSpeak(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const buildNextPrompt = (qNumber, skills) => {
    const questionPlan = {
      2: `Ask a foundational conceptual question directly related to one of the candidate's mentioned skills or technologies.`,
      3: `Ask an intermediate technical question about how they have used one of their mentioned skills in a real project — ask for specifics.`,
      4: `Ask a coding question. Ask them to write or explain code — for example a function, algorithm, or snippet relevant to their role and mentioned skills. Be specific about what to write.`,
      5: `Ask a problem-solving or debugging question — give a scenario or a buggy concept and ask them to find/fix the issue.`,
      6: `Ask about system design or architecture — something relevant to their role. For example, how they would design a feature or system they might build.`,
      7: `Ask a deeper technical question — performance optimization, best practices, or tradeoffs related to one of their skills.`,
      8: `Ask an advanced concept question — something a senior-level person in their field should know deeply.`,
      9: `Ask a situational or behavioral question related to a technical challenge — how they handled a real problem, a disagreement in a team, or a tough deadline.`,
      10: `This is the LAST question. Ask one final thoughtful question — either a concept they haven't been asked about yet, or ask what they would do differently in a past project. Then give a warm 1-sentence closing statement like "That's all from my side — I'll generate your feedback now." Do not say anything else after closing.`,
    };

    const plan = questionPlan[qNumber] || questionPlan[9];

    return `You are a professional technical interviewer for ${role?.label} (${level} level).
The candidate mentioned these skills: ${skills}.
This is question ${qNumber} of 10 in the interview.

${plan}

Rules:
- Ask only ONE question.
- Keep your response under 100 words.
- Start with a brief 1-sentence acknowledgment of their previous answer (optional for Q10).
- Write naturally as if speaking out loud — no markdown, no bullet points, no special symbols.
- Make the question directly relevant to the candidate's stated skills and the ${role?.label} role.`;
  };

  const submit = async () => {
    if (!input.trim() || loading) return;
    stopSpeaking();
    const ans = input.trim();
    setInput('');
    addMsg('user', ans, 'Your Answer');
    const nh = [...hist, { role: 'user', content: ans }];
    setHist(nh);

    let skills = candidateSkills;
    if (qNum === 1) {
      skills = ans;
      setCandidateSkills(ans);
    }

    setLoading(true);
    setAiSpeak(true);

    const nextQ = qNum + 1;
    const isLast = qNum >= MAX_QUESTIONS;

    if (isLast) {
      await genFeedback(nh);
      setLoading(false);
      setAiSpeak(false);
      return;
    }

    try {
      const sys = buildNextPrompt(nextQ, skills || 'general software development skills');
      const hs = nh.map((m) =>
        `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`
      ).join('\n\n');

      const text = await callClaude(
        `Conversation so far:\n${hs}\n\nNow ask question ${nextQ}.`,
        sys
      );

      const label = nextQ === MAX_QUESTIONS ? 'Question 10 of 10 — Final' : `Question ${nextQ} of 10`;
      addMsg('ai', text, label);
      const upd = [...nh, { role: 'assistant', content: text }];
      setHist(upd);
      setQNum(nextQ);
      speak(text);
    } catch (e) {
      setApiError('API Error: ' + e.message);
    }

    setLoading(false);
    setAiSpeak(false);
  };

  const genFeedback = async (h) => {
    setLoading(true);
    const sys = `You are an expert talent evaluator. Return ONLY valid JSON, no markdown, no extra text.`;
    const hs = h.map((m) =>
      `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`
    ).join('\n\n');

    const prompt = `${role?.label} (${level}) interview transcript:\n${hs}\n\nReturn ONLY this JSON:
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
    if (!sttSupported) { alert('Voice input requires Chrome or Edge.'); return; }
    if (recording) { recRef.current?.stop(); setRecording(false); return; }
    stopSpeaking();
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

  const toggleVoiceMode = () => {
    if (voiceMode) stopSpeaking();
    setVoiceMode((v) => !v);
  };

  const replayLast = () => {
    const lastAi = [...msgs].reverse().find((m) => m.role === 'ai');
    if (lastAi) speak(lastAi.text);
  };

  const handleStartClick = () => {
    unlockSpeech();
    setStarted(true);
  };

  // Pre-start screen
  if (!started) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', maxWidth: 480,
        margin: '0 auto', textAlign: 'center', gap: 18,
      }}>
        <span style={{ fontSize: 44 }}>{role?.icon}</span>
        <div>
          <div className="sg" style={{ fontSize: 20, fontWeight: 700, color: '#1A1A24', marginBottom: 6 }}>
            {role?.label} Interview
          </div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{level} · {MAX_QUESTIONS} questions</div>
        </div>
        <div style={{
          fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 380,
          background: '#fff', border: '1.5px solid #e8eaf0',
          borderRadius: 14, padding: '18px 22px', textAlign: 'left',
        }}>
          <div style={{ marginBottom: 10, color: '#1A1A24', fontWeight: 700 }} className="sg">
            What to expect:
          </div>
          <div>Q1 — Your skills &amp; background</div>
          <div>Q2–Q3 — Conceptual &amp; project questions</div>
          <div>Q4 — Coding / implementation</div>
          <div>Q5 — Problem solving &amp; debugging</div>
          <div>Q6 — System design</div>
          <div>Q7–Q8 — Advanced &amp; best practices</div>
          <div>Q9 — Situational / behavioral</div>
          <div>Q10 — Final question + feedback</div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
          {ttsSupported
            ? '🔊 Make sure your volume is on — AI will speak questions aloud.'
            : 'Questions will appear as text.'}
        </p>
        <button onClick={handleStartClick} className="pbtn sg" style={{
          background: '#00FFA3', border: 'none', borderRadius: 12,
          padding: '14px 40px', color: '#1A1A24', fontWeight: 800, fontSize: 15,
        }}>
          {ttsSupported ? '🔊 Start Interview' : 'Start Interview →'}
        </button>
        <button onClick={onExit} style={{
          background: 'transparent', border: '1.5px solid #e8eaf0',
          borderRadius: 8, padding: '7px 18px', color: '#6b7280',
          fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 820, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 16, marginBottom: 4,
        borderBottom: '1.5px solid #e8eaf0', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: '#2D1B69',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>{role?.icon}</div>
          <div>
            <div className="sg" style={{ fontSize: 15, fontWeight: 700, color: '#1A1A24' }}>{role?.label}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{level} · {MAX_QUESTIONS} questions</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < qNum ? '#00FFA3' : '#e8eaf0',
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
          {ttsSupported && (
            <button onClick={toggleVoiceMode} style={{
              background: voiceMode ? 'rgba(0,255,163,0.12)' : '#F8F9FA',
              border: `1.5px solid ${voiceMode ? '#00FFA3' : '#e8eaf0'}`,
              borderRadius: 8, padding: '5px 10px',
              color: voiceMode ? '#00a86b' : '#9ca3af',
              fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {voiceMode ? '🔊' : '🔇'}
            </button>
          )}
          <button onClick={onExit} style={{
            background: '#F8F9FA', border: '1.5px solid #e8eaf0',
            borderRadius: 8, padding: '5px 14px', color: '#6b7280',
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Exit</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#F0F1F5', borderRadius: 4, marginBottom: 20, flexShrink: 0 }}>
        <div className="pbar" style={{
          height: '100%', borderRadius: 4,
          width: `${Math.min(qNum, MAX_QUESTIONS) / MAX_QUESTIONS * 100}%`,
          background: 'linear-gradient(90deg, #2D1B69, #00FFA3)',
        }} />
      </div>

      {/* API error */}
      {apiError && (
        <div style={{
          background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 10,
          padding: 14, marginBottom: 16, color: '#ef4444', fontSize: 13,
          whiteSpace: 'pre-wrap', flexShrink: 0,
        }}>{apiError}</div>
      )}

      {/* Speaking indicator */}
      {speaking && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(0,255,163,0.06)', border: '1.5px solid rgba(0,255,163,0.3)',
          borderRadius: 10, padding: '8px 14px', marginBottom: 14, flexShrink: 0,
        }}>
          <Waveform active={true} />
          <span style={{ fontSize: 12, color: '#00a86b', flex: 1 }}>Interviewer is speaking…</span>
          <button onClick={stopSpeaking} style={{
            background: 'transparent', border: '1.5px solid rgba(0,168,107,0.3)',
            borderRadius: 6, padding: '3px 10px', color: '#00a86b',
            fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Skip</button>
        </div>
      )}

      {/* Chat */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 8 }}>
        {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: '#2D1B69',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🤖</div>
            <Waveform active={aiSpeak} />
          </div>
        )}
        {done && feedback && <FeedbackPanel feedback={feedback} role={roleId} level={level} />}
      </div>

      {/* Input */}
      {!done && (
        <div style={{ flexShrink: 0, paddingTop: 14, borderTop: '1.5px solid #e8eaf0', marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              disabled={loading}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder={qNum === 1
                ? 'Tell the interviewer about your skills, technologies and tools...'
                : 'Type your answer, or press 🎙️ to speak... (Enter to send)'}
              style={{
                flex: 1, background: '#fff',
                border: '1.5px solid #e8eaf0',
                borderRadius: 12, padding: '12px 15px', color: '#1A1A24',
                fontSize: 14, lineHeight: 1.65, transition: 'border-color 0.2s',
                fontFamily: 'Inter, sans-serif', resize: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00FFA3')}
              onBlur={(e) => (e.target.style.borderColor = '#e8eaf0')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={replayLast} disabled={!ttsSupported || loading}
                title="Replay last question"
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 16,
                  background: '#fff', border: '1.5px solid #e8eaf0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', opacity: ttsSupported ? 1 : 0.4,
                }}>🔁</button>
              <button onClick={toggleVoice}
                className={recording ? 'mic-act' : ''}
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 18,
                  background: recording ? '#fef2f2' : '#fff',
                  border: `1.5px solid ${recording ? '#fca5a5' : '#e8eaf0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                {recording ? '⏹' : '🎙️'}
              </button>
              <button onClick={submit} disabled={loading || !input.trim()}
                className="pbtn"
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: '#00FFA3',
                  border: 'none', color: '#1A1A24', fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800,
                }}>↑</button>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 7 }}>
            {recording
              ? '🔴 Listening… speak clearly'
              : `Enter to send · 🎙️ voice input · 🔁 replay · ${ttsSupported ? '🔊 toggles AI voice' : ''}`}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          flexShrink: 0, paddingTop: 16, borderTop: '1.5px solid #e8eaf0',
          marginTop: 8, display: 'flex', justifyContent: 'center',
        }}>
          <button onClick={onExit} className="pbtn sg" style={{
            background: '#00FFA3', border: 'none', borderRadius: 12,
            padding: '13px 36px', color: '#1A1A24', fontWeight: 800, fontSize: 14,
          }}>
            Back to Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
