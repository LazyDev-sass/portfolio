const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const COOKIE_NAME = 'portfolio_admin_session';
const SESSION_SECONDS = 4 * 60 * 60;

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function sign(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('base64url');
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => {
    const i = part.indexOf('=');
    return i < 0 ? [part.trim(), ''] : [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())];
  }));
}

function issueSession(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    nonce: crypto.randomBytes(16).toString('hex'),
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifySession(event) {
  if (!process.env.SESSION_SECRET) return false;
  const token = parseCookies(event.headers?.cookie || event.headers?.Cookie || '')[COOKIE_NAME];
  if (!token) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return parsed.sub === process.env.ADMIN_USERNAME &&
      Number.isFinite(parsed.exp) && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function cookieHeader(value, maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function hostOf(value) {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return '';
  }
}

// Behind Netlify's proxy the Host header can differ from the public domain the
// browser used, so compare the Origin against every host this request could be
// legitimately served from rather than Host alone.
function sameOrigin(event) {
  const h = event.headers || {};
  const origin = h.origin || h.Origin;
  if (!origin) return true;
  // Browsers set this header themselves and pages cannot forge it.
  const fetchSite = h['sec-fetch-site'] || h['Sec-Fetch-Site'];
  if (fetchSite === 'same-origin') return true;

  const originHost = hostOf(origin);
  if (!originHost) return false;
  const allowed = new Set([
    h.host, h.Host, h['x-forwarded-host'], h['X-Forwarded-Host'],
  ].filter(Boolean).flatMap((v) => String(v).split(',')).map((v) => v.trim().toLowerCase()));
  [event.rawUrl, process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL]
    .filter(Boolean).forEach((v) => { const host = hostOf(v); if (host) allowed.add(host); });
  return allowed.has(originHost);
}

async function verifyPassword(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !/^\$2[aby]\$/.test(hash)) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

module.exports = {
  COOKIE_NAME, SESSION_SECONDS, safeEqual, issueSession, verifySession,
  cookieHeader, sameOrigin, verifyPassword,
};
