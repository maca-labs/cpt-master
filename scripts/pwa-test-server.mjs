/** Test-only loopback server. Never include this helper in a deployment.
 * It serves dist without changing it and changes only the response bytes of
 * sw.js so Playwright can exercise a real waiting-worker lifecycle. */
import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1';
const PORT = 5174;
const ORIGIN = `http://${HOST}:${PORT}`;
const ROOT_PATH = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '../dist'));
const manifest = JSON.parse(await readFile(resolve(ROOT_PATH, 'manifest.webmanifest'), 'utf8'));
if (manifest.start_url !== '/' || manifest.scope !== '/') {
  throw new Error(
    'PWA update tests require a local production build with base=/, not the GitHub Pages build.',
  );
}
let revision = 0;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const withinRoot = (path) => {
  const child = relative(ROOT_PATH, path);
  return (
    !isAbsolute(child) && child !== '..' && !child.startsWith('../') && !child.startsWith('..\\')
  );
};
function send(response, status, body, type = 'text/plain; charset=utf-8', head = false) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': bytes.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(head ? undefined : bytes);
}

const server = createServer(async (request, response) => {
  try {
    if (request.socket.remoteAddress !== HOST || request.headers.host !== `${HOST}:${PORT}`) {
      send(response, 403, 'Loopback access only.');
      return;
    }
    if (!request.url?.startsWith('/') || request.url.startsWith('//')) {
      send(response, 400, 'Invalid request target.');
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(request.url.split('?')[0]);
    } catch {
      send(response, 400, 'Invalid URL encoding.');
      return;
    }
    if (
      pathname.includes('\\') ||
      pathname.includes('\0') ||
      pathname.split('/').some((part) => part === '..' || part === '.')
    ) {
      send(response, 403, 'Path traversal is not allowed.');
      return;
    }
    if (pathname === '/__test_revision') {
      if (request.method !== 'POST') {
        send(response, 405, 'POST required.');
        return;
      }
      if (request.headers.origin && request.headers.origin !== ORIGIN) {
        send(response, 403, 'Origin mismatch.');
        return;
      }
      if (Number(request.headers['content-length'] ?? 0) > 1024) {
        send(response, 413, 'Request too large.');
        return;
      }
      request.resume();
      revision++;
      send(response, 200, JSON.stringify({ revision }), 'application/json; charset=utf-8');
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method ?? '')) {
      send(response, 405, 'GET or HEAD required.');
      return;
    }
    if (pathname.startsWith('/__test_')) {
      send(response, 404, 'Not found.');
      return;
    }
    const requestedPath = resolve(ROOT_PATH, pathname === '/' ? 'index.html' : pathname.slice(1));
    if (!withinRoot(requestedPath)) {
      send(response, 403, 'Path outside dist.');
      return;
    }
    let actualPath;
    try {
      actualPath = await realpath(requestedPath);
    } catch {
      send(response, 404, 'Not found.');
      return;
    }
    if (!withinRoot(actualPath) || !(await stat(actualPath)).isFile()) {
      send(response, 403, 'Not a regular dist file.');
      return;
    }
    let body = await readFile(actualPath);
    if (pathname === '/sw.js')
      body = Buffer.concat([body, Buffer.from(`\n// PWA_TEST_ONLY_REVISION=${revision}\n`)]);
    send(
      response,
      200,
      body,
      types[extname(actualPath)] ?? 'application/octet-stream',
      request.method === 'HEAD',
    );
  } catch (error) {
    if (!response.headersSent) send(response, 500, 'Test server error.');
    else response.destroy();
    process.stderr.write(`${String(error)}\n`);
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.on('error', (error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
});
server.listen({ host: HOST, port: PORT, exclusive: true }, () => {
  process.stdout.write(`PWA_TEST_SERVER_READY ${ORIGIN} pid=${process.pid}\n`);
});
function stop() {
  server.close(() => process.exit(0));
  server.closeAllConnections();
  setTimeout(() => process.exit(0), 1000).unref();
}
process.once('SIGTERM', stop);
process.once('SIGINT', stop);
