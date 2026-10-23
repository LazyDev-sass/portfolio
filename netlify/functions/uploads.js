const Busboy = require('busboy');
const { connectLambda, getStore } = require('@netlify/blobs');
const crypto = require('crypto');
const { verifySession, sameOrigin } = require('./_lib/auth.cjs');

const store = (event) => {
  if (event.blobs) connectLambda(event);
  return getStore('portfolio-uploads');
};
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function parseUpload(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || '';
    let busboy;
    try { busboy = Busboy({ headers: { 'content-type': contentType }, limits: { files: 1, fileSize: MAX_BYTES } }); }
    catch { return reject(new Error('Expected multipart/form-data upload')); }

    let found = false;
    let fileBuffer = [];
    let fileType = '';
    let tooLarge = false;
    busboy.on('file', (field, stream, info) => {
      if (field !== 'file' || found) { stream.resume(); return; }
      found = true;
      fileType = info.mimeType || '';
      stream.on('data', (chunk) => fileBuffer.push(chunk));
      stream.on('limit', () => { tooLarge = true; });
    });
    busboy.on('error', reject);
    busboy.on('finish', () => {
      if (!found) return reject(new Error('Missing file field "file"'));
      if (tooLarge) return reject(new Error('Image exceeds the 5 MB limit'));
      if (!ALLOWED.has(fileType)) return reject(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'));
      resolve({ buffer: Buffer.concat(fileBuffer), contentType: fileType });
    });
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : Buffer.from(event.body || '', 'utf8');
    busboy.end(raw);
  });
}

exports.handler = async (event) => {
  const method = event.httpMethod;
  const headers = { 'Cache-Control': 'public, max-age=3600' };
  const storeInstance = store(event);

  if (method === 'POST') {
    if (!sameOrigin(event)) return { statusCode: 403, headers, body: JSON.stringify({ error: 'Cross-origin request rejected' }) };
    if (!verifySession(event)) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Admin login required' }) };
    try {
      const { buffer, contentType } = await parseUpload(event);
      const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' })[contentType];
      const key = `${Date.now()}-${crypto.randomBytes(12).toString('hex')}.${ext}`;
      await storeInstance.set(key, buffer, { metadata: { contentType } });
      return { statusCode: 200, headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ url: `/api/uploads/${key}` }) };
    } catch (err) {
      const message = err.message || 'Upload failed';
      return { statusCode: 400, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: message }) };
    }
  }

  if (method === 'GET') {
    const eventPath = event.path || '';
    const key = decodeURIComponent(eventPath.split('/').filter(Boolean).pop() || '');
    if (!/^[0-9]+-[a-f0-9]{24}\.(jpg|png|webp|gif)$/.test(key)) {
      return { statusCode: 404, headers: { ...headers, 'Content-Type': 'text/plain' }, body: 'Not found' };
    }
    try {
      const blob = await storeInstance.get(key, { type: 'arrayBuffer' });
      if (!blob) return { statusCode: 404, headers: { ...headers, 'Content-Type': 'text/plain' }, body: 'Not found' };
      const metadata = await storeInstance.getMetadata(key);
      const type = metadata?.metadata?.contentType || 'application/octet-stream';
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' },
        isBase64Encoded: true,
        body: Buffer.from(blob).toString('base64'),
      };
    } catch (err) {
      console.error('Image read failed:', err);
      return { statusCode: 500, headers: { ...headers, 'Content-Type': 'text/plain' }, body: 'Image unavailable' };
    }
  }
  return { statusCode: 405, headers: { ...headers, Allow: 'GET, POST', 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
};
