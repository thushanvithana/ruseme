import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { root } from './build.mjs';

const production = process.argv.includes('--production');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

function resolveFile(url) {
  let pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  if (pathname === '/') pathname = '/index.html';
  let directory = 'public';
  if (production) directory = 'dist';
  else if (pathname.startsWith('/assets/css/')) {
    directory = 'src/styles'; pathname = pathname.slice('/assets/css'.length);
  } else if (pathname.startsWith('/assets/js/')) {
    directory = 'src/scripts'; pathname = pathname.slice('/assets/js'.length);
  } else if (pathname.endsWith('.html')) directory = 'src/pages';
  const base = path.resolve(root, directory);
  const file = path.resolve(base, `.${pathname}`);
  if (!file.startsWith(base + path.sep)) return null;
  return file;
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('This static server does not process form submissions.'); return;
  }
  try {
    const file = resolveFile(request.url);
    if (!file || !(await stat(file)).isFile()) throw new Error('Not found');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': body.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Page or asset not found.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Portfolio running at http://localhost:${port}`));
