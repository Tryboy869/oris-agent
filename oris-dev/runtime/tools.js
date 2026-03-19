// tools.js — Outils disponibles pour l'agent ORIS
// L'IA peut modifier ce fichier pour ajouter de nouveaux outils

// Outil : appel LLM générique multi-provider
async function toolLLM({ provider, key, model, system, user, maxTokens = 4000 }) {
  const PROVIDERS = {
    claude:     { url: 'https://api.anthropic.com/v1/messages' },
    openai:     { url: 'https://api.openai.com/v1/chat/completions' },
    groq:       { url: 'https://api.groq.com/openai/v1/chat/completions' },
    openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions' },
    grok:       { url: 'https://api.x.ai/v1/chat/completions' },
    gemini:     { url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` },
  };

  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Provider inconnu: ${provider}`);

  const headers = { 'Content-Type': 'application/json' };
  let body;

  if (provider === 'claude') {
    headers['x-api-key'] = key;
    headers['anthropic-version'] = '2023-06-01';
    body = { model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] };
  } else if (provider === 'gemini') {
    const url = p.url + '?key=' + key;
    body = { contents: [{ role: 'user', parts: [{ text: system + '

' + user }] }], generationConfig: { maxOutputTokens: maxTokens } };
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    const d = await r.json();
    return { text: d.candidates?.[0]?.content?.parts?.[0]?.text || '', tokens: d.usageMetadata?.totalTokenCount || 0 };
  } else {
    headers['Authorization'] = `Bearer ${key}`;
    body = { model, max_tokens: maxTokens, temperature: 0.6, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] };
  }

  const r = await fetch(p.url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!r.ok) { const e = await r.text(); throw new Error(`${r.status}: ${e.substring(0, 300)}`); }
  const d = await r.json();

  let text = '', tokens = 0;
  if (provider === 'claude') {
    text   = d.content?.[0]?.text || '';
    tokens = (d.usage?.input_tokens || 0) + (d.usage?.output_tokens || 0);
  } else {
    text   = d.choices?.[0]?.message?.content || '';
    tokens = d.usage?.total_tokens || 0;
  }
  return { text, tokens };
}

// Outil : commit GitHub
async function toolGithubCommit({ token, repo, branch, filePath, content, message }) {
  const headers = { 'Authorization': `token ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' };
  let sha;
  try {
    const ex = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, { headers });
    if (ex.ok) { const d = await ex.json(); sha = d.sha; }
  } catch(e) {}

  const body = { message, content: btoa(unescape(encodeURIComponent(content))), branch };
  if (sha) body.sha = sha;

  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!r.ok) { const e = await r.json(); throw new Error(e.message || r.status); }
  return true;
}

// Outil : lecture GitHub
async function toolGithubRead({ token, repo, branch, filePath }) {
  const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, { headers });
  if (!r.ok) return null;
  const d = await r.json();
  return decodeURIComponent(escape(atob(d.content.replace(/
/g, ''))));
}

// Outil : envoi Telegram
async function toolTelegramSend({ token, chatId, text }) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  });
}

// Outil : listing fichiers GitHub
async function toolGithubListFiles({ token, repo, branch, path = '' }) {
  const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, { headers });
  if (!r.ok) return [];
  const d = await r.json();
  return Array.isArray(d) ? d.map(f => ({ name: f.name, path: f.path, type: f.type, size: f.size })) : [];
}

window.ORIS_TOOLS = { toolLLM, toolGithubCommit, toolGithubRead, toolTelegramSend, toolGithubListFiles };
