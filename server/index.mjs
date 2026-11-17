// Local server: the JSON API (data in one file) + the built Angular app. On Vercel the API runs
// from api/[...path].mjs instead and the static files are served by Vercel.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApi } from './api.mjs';
import { blobStore, fileStore } from './stores.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Kept outside the project folder: ng serve watches the project and reloads the page on every save.
const DATA_FILE = process.env.DATA_FILE ? resolve(process.env.DATA_FILE) : join(ROOT, '..', 'grad-invitation-data', 'data.json');
const STATIC_DIR = join(ROOT, 'dist', 'grad-invitation', 'browser');
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

// ---- static files + SPA fallback ----
async function serveStatic(res, pathname) {
  let rel;
  try {
    rel = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
  } catch {
    rel = '';
  }
  let file = join(STATIC_DIR, rel);
  if (!file.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file');
  } catch {
    if (extname(rel)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    file = join(STATIC_DIR, 'index.html'); // client-side route
  }
  try {
    const body = await readFile(file);
    const hashed = /-[A-Za-z0-9_]{8}\.(js|css)$/.test(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('App not built. Run "npm run build" first.');
  }
}

const api = createApi(process.env.BLOB_READ_WRITE_TOKEN ? blobStore() : fileStore(DATA_FILE));

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      return res.end();
    }
    return await serveStatic(res, url.pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}  (data: ${DATA_FILE})`));
