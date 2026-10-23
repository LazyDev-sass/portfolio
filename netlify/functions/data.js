const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { verifySession, sameOrigin } = require('./_lib/auth.cjs');

const store = () => getStore('portfolio-content');
const fallbackPath = path.join(__dirname, '..', '..', 'public', 'data.json');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (event.httpMethod === 'GET') {
    try {
      const saved = await store().get('data.json', { type: 'json' });
      if (saved && typeof saved === 'object') {
        return { statusCode: 200, headers, body: JSON.stringify(saved) };
      }
      const fallback = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      return { statusCode: 200, headers, body: JSON.stringify(fallback) };
    } catch (err) {
      console.error('Portfolio read failed:', err);
      try {
        return { statusCode: 200, headers, body: JSON.stringify(JSON.parse(fs.readFileSync(fallbackPath, 'utf8'))) };
      } catch {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Portfolio content is unavailable.' }) };
      }
    }
  }

  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, headers: { ...headers, Allow: 'GET, PUT' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!sameOrigin(event)) return { statusCode: 403, headers, body: JSON.stringify({ error: 'Cross-origin request rejected' }) };
  if (!verifySession(event)) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Admin login required' }) };

  let data;
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      !data.welcome || !data.about || !data.contact ||
      !Array.isArray(data.education) || !Array.isArray(data.skills) ||
      !Array.isArray(data.projects) || !Array.isArray(data.certifications)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON does not match the portfolio schema' }) };
  }
  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > 1024 * 1024) {
    return { statusCode: 413, headers, body: JSON.stringify({ error: 'Portfolio JSON is too large (1 MB maximum)' }) };
  }

  try {
    await store().setJSON('data.json', data);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Portfolio write failed:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Could not save portfolio data' }) };
  }
};
