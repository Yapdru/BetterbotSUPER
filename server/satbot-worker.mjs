// SatBot server on Cloudflare Workers.
// Holds the Gemini key (secret GEMINI_API_KEY) and the shared cache (KV binding CACHE).
// Requests must carry a Firebase sign-in token; we verify it with Google before doing anything.

const ALLOWED_ORIGINS = [
  'https://betterai-3ca66.web.app',
  'https://betterai-3ca66.firebaseapp.com',
  'http://localhost:5000', 'http://127.0.0.1:5500'
];
const FIREBASE_WEB_API_KEY = 'AIzaSyAqbIzJmnn2xDonaj8Y9Ht66t30lO50nxM'; // public web key, not secret
const MAX_PER_MINUTE = 20;

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}
const json = (obj, status, origin) => new Response(JSON.stringify(obj), {
  status: status || 200, headers: { 'Content-Type': 'application/json', ...cors(origin) } });

// Ask Google whether this Firebase ID token is real and not expired.
async function verifyUser(token) {
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_WEB_API_KEY, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }) });
  if (!r.ok) return null;
  const d = await r.json();
  const u = d.users && d.users[0];
  if (!u || !u.localId) return null;
  // Only accept verified emails (Google and email-link accounts are verified; plain sign-up is not).
  const verified = u.emailVerified === true || (u.providerUserInfo || []).some(p => p.providerId === 'google.com');
  return verified ? u.localId : null;
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple per-user limit using KV (approximate; KV is eventually consistent).
async function overLimit(env, uid) {
  const minute = Math.floor(Date.now() / 60000);
  const key = 'rl:' + uid + ':' + minute;
  const n = (+(await env.CACHE.get(key))) || 0;
  if (n >= MAX_PER_MINUTE) return true;
  await env.CACHE.put(key, String(n + 1), { expirationTtl: 120 });
  return false;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/knowledge') {
      // Public, attributed library only. No AI calls or automatic writes.
      if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({error:'Origin not allowed'},403,origin);
      const query = (url.searchParams.get('q') || '').trim().toLowerCase();
      if (query.length > 200) return json({error:'Query too long'},400,origin);
      try {
        const library = await env.CACHE.get('knowledge:pilot:v1', 'json');
        if (!library || !Array.isArray(library.entries)) return json({error:'Library unavailable'},503,origin);
        const terms = query.split(/\s+/).filter(Boolean);
        const matches = library.entries.slice(0,100).filter(entry => {
          const text = (entry.title + ' ' + (entry.tags || []).join(' ')).toLowerCase();
          return terms.every(term => text.includes(term));
        }).slice(0,5);
        return json({library:'Coding knowledge pilot',total:library.entries.length,results:matches},200,origin);
      } catch (_) { return json({error:'Knowledge service unavailable'},503,origin); }
    }
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);

    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ error: 'Sign in first' }, 401, origin);
    const uid = await verifyUser(token);
    if (!uid) return json({ error: 'Sign in first' }, 401, origin);
    if (await overLimit(env, uid)) return json({ error: 'Too many requests. Wait a minute.' }, 429, origin);

    let body = {};
    try { body = await request.json(); } catch (e) { return json({ error: 'Bad request' }, 400, origin); }
    const system = String(body.system || '').slice(0, 4000);
    const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
    const userText = String(body.userText || '').slice(0, 4000);
    if (!userText) return json({ error: 'Empty question' }, 400, origin);

    // Shared cache only for standalone, non-FastZap questions.
    const standalone = history.length === 0 && !body.fast;
    const key = standalone ? await sha256Hex(userText.toLowerCase().replace(/\s+/g, ' ').trim()) : null;
    if (standalone) {
      const hit = await env.CACHE.get('q:' + key);
      if (hit) return json({ text: hit, cached: true }, 200, origin);
    }

    const contents = history.concat([{ role: 'user', content: userText }]).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content).slice(0, 4000) }]
    }));
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents })
    });
    if (!r.ok) return json({ error: 'AI service error (' + r.status + ')' }, 502, origin);
    const data = await r.json();
    const text = ((data.candidates || [])[0] || {}).content?.parts?.[0]?.text?.trim() || '(no reply)';

    if (standalone && text !== '(no reply)') {
      await env.CACHE.put('q:' + key, text.slice(0, 8000));
    }
    return json({ text, cached: false }, 200, origin);
  }
};