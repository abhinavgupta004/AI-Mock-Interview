// Serverless proxy: Groq API key sirf server par rehti hai, browser mein kabhi nahi.
// Vercel par /api/chat ban jaata hai; local mein src/setupProxy.js isi ko chalata hai.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const key = (process.env.GROQ_API_KEY || '').trim();
  if (!key) {
    return res.status(500).json({
      error: { message: 'GROQ_API_KEY server par set nahi hai (.env ya Vercel env variables check karo)' },
    });
  }

  const { systemPrompt, userPrompt } = req.body || {};
  if (!userPrompt) {
    return res.status(400).json({ error: { message: 'userPrompt missing' } });
  }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: (process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim(),
        max_tokens: 2000,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: systemPrompt || '' },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const data = await r.json().catch(() => ({}));
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: { message: 'Groq se connect nahi ho paya: ' + e.message } });
  }
};
