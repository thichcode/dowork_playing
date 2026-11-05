export class LLMProvider {
  constructor(options = {}) {
    this.enabled = options.enabled ?? false;
    this.provider = options.provider || 'gemini'; // 'gemini' | 'openai' | 'custom'
    this.apiKey = options.apiKey || '';
    this.baseUrl = options.baseUrl || '';
  }

  updateConfig(config = {}) {
    if (config.enabled !== undefined) this.enabled = config.enabled;
    if (config.provider !== undefined) this.provider = config.provider;
    if (config.apiKey !== undefined) this.apiKey = config.apiKey;
    if (config.baseUrl !== undefined) this.baseUrl = config.baseUrl;
  }

  async generate(systemPrompt, userPrompt, options = {}) {
    if (!this.enabled || !this.apiKey) return null;

    const timeoutMs = options.timeoutMs || 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (this.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nContext & Yêu cầu:\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 400
            }
          })
        });

        if (!res.ok) throw new Error(`Gemini HTTP Error: ${res.status}`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }

      if (this.provider === 'openai') {
        const url = this.baseUrl || 'https://api.openai.com/v1/chat/completions';
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 400
          })
        });

        if (!res.ok) throw new Error(`OpenAI HTTP Error: ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;
      }
    } catch (err) {
      console.warn('LLM Generation failed or timed out, falling back to static:', err.message);
      return null;
    } finally {
      clearTimeout(timeoutId);
    }

    return null;
  }
}

export const globalLLMProvider = new LLMProvider();
