import { ANTHROPIC_API_KEY } from '../constants';

/**
 * Calls the Anthropic Claude API.
 * @param {string} userPrompt - The user message
 * @param {string} systemPrompt - The system instruction
 * @returns {Promise<string>} - The assistant's text response
 */
export async function callClaude(userPrompt, systemPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.map((b) => b.text || '').join('') || '';
}
