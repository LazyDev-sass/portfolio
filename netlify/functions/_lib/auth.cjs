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

function sameOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const host = event.headers?.host || event.headers?.Host;
  if (!origin || !host) return true;
  try {
    return new URL(origin).host.toLowerCase() === String(host).toLowerCase();
  } catch {
    return false;
  }
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
