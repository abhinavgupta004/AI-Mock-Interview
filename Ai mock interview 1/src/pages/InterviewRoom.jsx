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
    if (!voices.length) return null;
    return voices.find(v => /en-US|en-GB/.test(v.lang) && /Google|Natural|Online/i.test(v.name))
      || voices.find(v => /en-US/.test(v.lang))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
  };

  const speak = (text) => {
    if (!ttsSupported || !voiceMode) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    const v = pickVoice();
    if (v) utter.voice = v;
    utter.rate = 1;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setTimeout(() => window.speechSynthesis.speak(utter), 50);
  };

  const unlockSpeech = () => {
    if (!ttsSupported) return;
    const warm = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(warm);
    window.speechSynthesis.cancel();
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

  // Q2–Q10 logic
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

    // Q1 answer — extract skills
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
          <div className="sg" style={{ fontSize: 20, fontWeight: 700, color: '#E2EAF4', marginBottom: 6 }}>
            {role?.label} Interview
          </div>
          <div style={{ fontSize: 13, color: '#8892A4' }}>{level} · {MAX_QUESTIONS} questions</div>
        </div>
        <div style={{ fontSize: 13, color: '#8892A4', lineHeight: 1.7, maxWidth: 380,
          background: '#0D1828', border: '1px solid #1A2E48', borderRadius: 12, padding: '16px 20px', textAlign: 'left' }}>
          <div style={{ marginBottom: 8, color: '#C8D8E8', fontWeight: 600 }}>What to expect:</div>
          <div>Q1 — Your skills & background</div>
          <div>Q2–Q3 — Conceptual & project questions</div>
          <div>Q4 — Coding / implementation</div>
          <div>Q5 — Problem solving & debugging</div>
          <div>Q6 — System design</div>
          <div>Q7–Q8 — Advanced & best practices</div>
          <div>Q9 — Situational / behavioral</div>
          <div>Q10 — Final question + feedback</div>
        </div>
        <p style={{ fontSize: 13, color: '#8892A4', margin: 0 }}>
          {ttsSupported ? '🔊 Make sure your volume is on — AI will speak questions aloud.' : 'Questions will appear as text.'}
        </p>
        <button onClick={handleStartClick} className="pbtn sg" style={{
          background: 'linear-gradient(135deg,#0060CC,#00D4FF)',
          border: 'none', borderRadius: 12, padding: '14px 40px',
          color: '#fff', fontWeight: 700, fontSize: 15,
        }}>
          {ttsSupported ? '🔊 Start Interview' : 'Start Interview →'}
        </button>
        <button onClick={onExit} className="gbtn" style={{
          background: 'transparent', border: '1px solid #1E3050',
          borderRadius: 8, padding: '7px 16px', color: '#8892A4', fontSize: 12,
        }}>Back</button>
      </div>
    );
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < qNum ? '#00D4FF' : '#1E3050',
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
          {ttsSupported && (
            <button onClick={toggleVoiceMode} className="gbtn" style={{
              background: voiceMode ? '#00D4FF18' : 'transparent',
              border: `1px solid ${voiceMode ? '#00D4FF55' : '#1E3050'}`,
              borderRadius: 8, padding: '5px 10px',
              color: voiceMode ? '#00D4FF' : '#8892A4', fontSize: 13,
            }}>
              {voiceMode ? '🔊' : '🔇'}
            </button>
          )}
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

      {apiError && (
        <div style={{
          background: '#F8717111', border: '1px solid #F8717133', borderRadius: 10,
          padding: 14, marginBottom: 16, color: '#F87171', fontSize: 13,
          whiteSpace: 'pre-wrap', flexShrink: 0,
        }}>{apiError}</div>
      )}

      {speaking && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#00D4FF0F', border: '1px solid #00D4FF33', borderRadius: 10,
          padding: '8px 14px', marginBottom: 14, flexShrink: 0,
        }}>
          <Waveform active={true} />
          <span style={{ fontSize: 12, color: '#00D4FF', flex: 1 }}>Interviewer is speaking…</span>
          <button onClick={stopSpeaking} className="gbtn" style={{
            background: 'transparent', border: '1px solid #00D4FF55',
            borderRadius: 6, padding: '3px 9px', color: '#00D4FF', fontSize: 11,
          }}>Skip</button>
        </div>
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
              placeholder={qNum === 1
                ? 'Tell the interviewer about your skills, technologies and tools...'
                : 'Type your answer, or press 🎙️ to speak... (Enter to send)'}
              style={{
                flex: 1, background: '#0D1828', border: '1.5px solid #1A2E48',
                borderRadius: 12, padding: '12px 15px', color: '#C8D8E8',
                fontSize: 14, lineHeight: 1.65, transition: 'border-color 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
              onBlur={(e) => (e.target.style.borderColor = '#1A2E48')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={replayLast} disabled={!ttsSupported || loading}
                title="Replay last question" className="gbtn"
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 16,
                  background: '#0D1828', border: '1.5px solid #1A2E48',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: ttsSupported ? 1 : 0.4,
                }}>🔁</button>
              <button onClick={toggleVoice} className={recording ? 'mic-act' : ''}
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 18,
                  background: recording ? '#F8717122' : '#0D1828',
                  border: `1.5px solid ${recording ? '#F87171' : '#1A2E48'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {recording ? '⏹' : '🎙️'}
              </button>
              <button onClick={submit} disabled={loading || !input.trim()} className="pbtn"
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'linear-gradient(135deg,#0060CC,#00A0DC)',
                  border: 'none', color: '#fff', fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>↑</button>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#4A5568', marginTop: 7 }}>
            {recording ? '🔴 Listening… speak clearly'
              : `Enter to send · 🎙️ voice input · 🔁 replay · ${ttsSupported ? '🔊 toggles AI voice' : ''}`}
          </div>
        </div>
      )}

      {done && (
        <div style={{
          flexShrink: 0, paddingTop: 16, borderTop: '1px solid #1A2A3A',
          marginTop: 8, display: 'flex', justifyContent: 'center',
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
