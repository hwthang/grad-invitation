// REST API for invitations, independent of where the data is stored (see stores.mjs).
const KEY_RE = /^[a-z0-9][a-z0-9-]{0,59}$/;
const THEMES = ['blue', 'pink'];
const STATUSES = ['PENDING', 'ATTENDING', 'NOT_ATTENDING'];
const MAX_BODY = 4 * 1024 * 1024; // avatars are stored as small data URLs

const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const httpError = (status, message) => Object.assign(new Error(message), { status });

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readJson(req) {
  // Some runtimes (Vercel) have already parsed the body.
  if (req.body !== undefined && req.body !== null) {
    try {
      if (Buffer.isBuffer(req.body)) return Promise.resolve(JSON.parse(req.body.toString('utf8') || '{}'));
      return Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body);
    } catch {
      return Promise.reject(httpError(400, 'Invalid JSON'));
    }
  }
  return new Promise((ok, fail) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        fail(httpError(413, 'Body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        fail(httpError(400, 'Invalid JSON'));
      }
    });
    req.on('error', fail);
  });
}

function cleanName(v) {
  if (typeof v !== 'string' || !v.trim() || v.length > 100) throw httpError(400, 'Invalid name');
  return v.trim();
}

function cleanTheme(v) {
  if (!THEMES.includes(v)) throw httpError(400, 'Invalid theme');
  return v;
}

function cleanAvatar(v) {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'string' || v.length > 3_000_000 || !/^(data:image\/|\/|https?:\/\/)/.test(v)) {
    throw httpError(400, 'Invalid avatar');
  }
  return v;
}

function cleanContent(v) {
  if (v === undefined) return {};
  if (!isObj(v)) throw httpError(400, 'Invalid content');
  return v;
}

function existing(db, key) {
  if (!has(db.invitations, key)) throw httpError(404, 'Not found');
  return db.invitations[key];
}

export function createApi(store) {
  async function route(req, res, url) {
    const parts = url.pathname.split('/').filter(Boolean).slice(1); // drop "api"
    if (parts[0] !== 'invitations' || parts.length > 3) throw httpError(404, 'Not found');

    const key = parts[1];
    if (key !== undefined && !KEY_RE.test(key)) throw httpError(404, 'Not found');

    if (parts.length === 1) {
      if (req.method === 'GET') return send(res, 200, Object.values((await store.read()).invitations));
      if (req.method === 'POST') {
        const body = await readJson(req);
        if (typeof body.key !== 'string' || !KEY_RE.test(body.key)) throw httpError(400, 'Invalid key');
        const inv = await store.mutate((db) => {
          if (has(db.invitations, body.key)) throw httpError(409, 'Key already exists');
          const created = {
            key: body.key,
            name: cleanName(body.name),
            theme: cleanTheme(body.theme ?? 'blue'),
            avatar: cleanAvatar(body.avatar),
            content: cleanContent(body.content),
            rsvp: { status: 'PENDING', updatedAt: '' },
            createdAt: new Date().toISOString(),
          };
          if (!created.avatar) delete created.avatar;
          db.invitations[created.key] = created;
          return created;
        });
        return send(res, 201, inv);
      }
    } else if (parts.length === 2) {
      if (req.method === 'GET') return send(res, 200, existing(await store.read(), key));
      if (req.method === 'PUT') {
        const body = await readJson(req);
        const next = await store.mutate((db) => {
          const updated = {
            ...existing(db, key),
            name: cleanName(body.name),
            theme: cleanTheme(body.theme),
            avatar: cleanAvatar(body.avatar),
            content: cleanContent(body.content),
          };
          if (!updated.avatar) delete updated.avatar;
          db.invitations[key] = updated;
          return updated;
        });
        return send(res, 200, next);
      }
      if (req.method === 'DELETE') {
        await store.mutate((db) => {
          existing(db, key);
          delete db.invitations[key];
        });
        return send(res, 204);
      }
    } else if (parts[2] === 'rsvp' && req.method === 'POST') {
      const body = await readJson(req);
      if (!STATUSES.includes(body.status)) throw httpError(400, 'Invalid status');
      const inv = await store.mutate((db) => {
        const target = existing(db, key);
        target.rsvp = { status: body.status, updatedAt: new Date().toISOString() };
        return target;
      });
      return send(res, 200, inv);
    }
    throw httpError(405, 'Method not allowed');
  }

  return async function api(req, res, url) {
    try {
      await route(req, res, url);
    } catch (e) {
      if (!e.status) console.error(e);
      if (!res.headersSent) send(res, e.status ?? 500, { error: e.status ? e.message : 'Server error' });
    }
  };
}
