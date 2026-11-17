// Tiny dependency-free server: JSON API backed by one file (data/data.json) + the built Angular app.
import { createServer } from 'node:http';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Kept outside the project folder: ng serve watches the project and reloads the page on every save.
const DATA_FILE = process.env.DATA_FILE ? resolve(process.env.DATA_FILE) : join(ROOT, '..', 'grad-invitation-data', 'data.json');
const STATIC_DIR = join(ROOT, 'dist', 'grad-invitation', 'browser');
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY = 4 * 1024 * 1024; // avatars are stored as small data URLs
const KEY_RE = /^[a-z0-9][a-z0-9-]{0,59}$/;
const THEMES = ['blue', 'pink'];
const STATUSES = ['PENDING', 'ATTENDING', 'NOT_ATTENDING'];

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

// ---- storage: single JSON file, writes serialized and atomic ----
let db = { invitations: {} };
let queue = Promise.resolve();

async function load() {
  try {
    const parsed = JSON.parse(await readFile(DATA_FILE, 'utf8'));
    if (parsed && typeof parsed.invitations === 'object' && parsed.invitations) db = parsed;
  } catch (e) {
    if (e.code !== 'ENOENT') throw new Error(`Cannot read ${DATA_FILE}: ${e.message}`);
    await save();
  }
}

function save() {
  queue = queue.then(async () => {
    await mkdir(dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 2));
    await rename(tmp, DATA_FILE);
  });
  return queue;
}

// ---- helpers ----
const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function readJson(req) {
  return new Promise((ok, fail) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        fail(Object.assign(new Error('Body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        fail(badRequest('Invalid JSON'));
      }
    });
    req.on('error', fail);
  });
}

function cleanName(v) {
  if (typeof v !== 'string' || !v.trim() || v.length > 100) throw badRequest('Invalid name');
  return v.trim();
}

function cleanTheme(v) {
  if (!THEMES.includes(v)) throw badRequest('Invalid theme');
  return v;
}

function cleanAvatar(v) {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'string' || v.length > 3_000_000 || !/^(data:image\/|\/|https?:\/\/)/.test(v)) {
    throw badRequest('Invalid avatar');
  }
  return v;
}

function cleanContent(v) {
  if (v === undefined) return {};
  if (!isObj(v)) throw badRequest('Invalid content');
  return v;
}

// ---- API ----
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // drop "api"
  if (parts[0] !== 'invitations' || parts.length > 3) return send(res, 404, { error: 'Not found' });

  const key = parts[1];
  const isCreate = parts.length === 1 && req.method === 'POST';
  if (key !== undefined && (!KEY_RE.test(key) || !has(db.invitations, key))) {
    return send(res, 404, { error: 'Not found' });
  }

  if (parts.length === 1) {
    if (req.method === 'GET') return send(res, 200, Object.values(db.invitations));
    if (isCreate) {
      const body = await readJson(req);
      if (typeof body.key !== 'string' || !KEY_RE.test(body.key)) throw badRequest('Invalid key');
      if (has(db.invitations, body.key)) return send(res, 409, { error: 'Key already exists' });
      const inv = {
        key: body.key,
        name: cleanName(body.name),
        theme: cleanTheme(body.theme ?? 'blue'),
        avatar: cleanAvatar(body.avatar),
        content: cleanContent(body.content),
        rsvp: { status: 'PENDING', updatedAt: '' },
        createdAt: new Date().toISOString(),
      };
      if (!inv.avatar) delete inv.avatar;
      db.invitations[inv.key] = inv;
      await save();
      return send(res, 201, inv);
    }
  } else if (parts.length === 2) {
    const inv = db.invitations[key];
    if (req.method === 'GET') return send(res, 200, inv);
    if (req.method === 'PUT') {
      const body = await readJson(req);
      const next = {
        ...inv,
        name: cleanName(body.name),
        theme: cleanTheme(body.theme),
        avatar: cleanAvatar(body.avatar),
        content: cleanContent(body.content),
      };
      if (!next.avatar) delete next.avatar;
      db.invitations[key] = next;
      await save();
      return send(res, 200, next);
    }
    if (req.method === 'DELETE') {
      delete db.invitations[key];
      await save();
      return send(res, 204);
    }
  } else if (parts[2] === 'rsvp' && req.method === 'POST') {
    const body = await readJson(req);
    if (!STATUSES.includes(body.status)) throw badRequest('Invalid status');
    const inv = db.invitations[key];
    inv.rsvp = { status: body.status, updatedAt: new Date().toISOString() };
    await save();
    return send(res, 200, inv);
  }
  return send(res, 405, { error: 'Method not allowed' });
}

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

await load();
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
    if (!res.headersSent) send(res, e.status ?? 500, { error: e.status ? e.message : 'Server error' });
    if (!e.status) console.error(e);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}  (data: ${DATA_FILE})`));
