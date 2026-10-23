const {
  COOKIE_NAME, SESSION_SECONDS, safeEqual, issueSession, verifySession,
  cookieHeader, sameOrigin, verifyPassword,
} = require('./_lib/auth.cjs');

exports.handler = async (event) => {
  const method = event.httpMethod;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'Admin authentication is not configured.' }) };
  }
  if (method === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify({ authenticated: verifySession(event) }) };
  }
  if (!['POST', 'DELETE'].includes(method)) {
    return { statusCode: 405, headers: { ...headers, Allow: 'GET, POST, DELETE' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!sameOrigin(event)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Cross-origin request rejected' }) };
  }

  if (method === 'DELETE') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Set-Cookie': cookieHeader('', 0) },
      body: JSON.stringify({ ok: true }),
    };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const username = String(body.username || '');
  const password = String(body.password || '');
  if (username.length > 120 || password.length > 1024) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid credentials format' }) };
  }
  const usernameOk = safeEqual(username, process.env.ADMIN_USERNAME);
  const passwordOk = await verifyPassword(password);
  if (!usernameOk || !passwordOk) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid username or password' }) };
  }

  const token = issueSession(username);
  return {
    statusCode: 200,
    headers: { ...headers, 'Set-Cookie': cookieHeader(token) },
    body: JSON.stringify({ ok: true }),
  };
};
