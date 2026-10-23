const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadHandler(authorized = true) {
  const exports = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../netlify/functions/data.js'), 'utf8'), {
    exports,
    __dirname: path.join(__dirname, '../netlify/functions'),
    Buffer,
    console: { error() {} },
    require(name) {
      if (name === './_lib/auth.cjs') return { sameOrigin: () => true, verifySession: () => authorized };
      return require(name);
    },
  });
  return exports.handler;
}

// Exercise the real Blobs SDK, with a synthetic Lambda context and no network.
const event = (method, body) => ({
  httpMethod: method,
  headers: { 'x-nf-site-id': 'test-site', 'x-nf-deploy-id': 'test-deploy' },
  blobs: Buffer.from(JSON.stringify({ url: 'https://blobs.example.test', token: 'test-only' })).toString('base64'),
  body: JSON.stringify(body),
});
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data.json'), 'utf8'));

test('Lambda save and subsequent read use the supplied Blobs context', async () => {
  const originalFetch = global.fetch;
  const originalContext = process.env.NETLIFY_BLOBS_CONTEXT;
  let saved;
  const methods = [];
  global.fetch = async (url, options) => {
    assert.equal(new URL(url).hostname, 'blobs.example.test');
    assert.match(new URL(url).pathname, /portfolio-content\/data.json$/);
    methods.push(options.method.toUpperCase());
    if (options.method.toUpperCase() === 'PUT') {
      saved = JSON.parse(options.body);
      return new Response(null, { status: 200 });
    }
    return Response.json(saved);
  };
  try {
    delete process.env.NETLIFY_BLOBS_CONTEXT;
    const handler = loadHandler();
    assert.equal((await handler(event('PUT', data))).statusCode, 200);
    assert.deepEqual(saved, data);
    delete process.env.NETLIFY_BLOBS_CONTEXT;
    const response = await handler(event('GET'));
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), data);
    assert.deepEqual(methods, ['PUT', 'GET']);
  } finally {
    global.fetch = originalFetch;
    if (originalContext === undefined) delete process.env.NETLIFY_BLOBS_CONTEXT;
    else process.env.NETLIFY_BLOBS_CONTEXT = originalContext;
  }
});

test('unauthenticated saves are rejected before storage access', async () => {
  assert.equal((await loadHandler(false)({ httpMethod: 'PUT', headers: {} })).statusCode, 401);
});

test('invalid JSON and schema are rejected before storage access', async () => {
  const handler = loadHandler();
  assert.equal((await handler({ httpMethod: 'PUT', headers: {}, body: '{' })).statusCode, 400);
  assert.equal((await handler({ httpMethod: 'PUT', headers: {}, body: '{}' })).statusCode, 400);
});
