// Storage backends for the single data.json document: local file, or Vercel Blob.
// Both expose { read(): Promise<db>, mutate(fn): Promise<result> }. `fn(db)` edits db in place,
// may throw (nothing is saved then) and must be safe to re-run (Blob retries on conflicts).
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const empty = () => ({ invitations: {} });
const normalize = (v) => (v && typeof v.invitations === 'object' && v.invitations ? v : empty());

export function fileStore(file) {
  let queue = Promise.resolve();

  async function read() {
    try {
      return normalize(JSON.parse(await readFile(file, 'utf8')));
    } catch (e) {
      if (e.code === 'ENOENT') return empty();
      throw e;
    }
  }

  async function write(db) {
    await mkdir(dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 2));
    await rename(tmp, file);
  }

  // Serialized so concurrent requests cannot interleave their read-modify-write.
  function mutate(fn) {
    const run = queue.then(async () => {
      const db = await read();
      const result = await fn(db);
      await write(db);
      return result;
    });
    queue = run.catch(() => {});
    return run;
  }

  return { read, mutate };
}

// Must match the Blob store type. Set BLOB_ACCESS=private for a private store.
const ACCESS = process.env.BLOB_ACCESS === 'private' ? 'private' : 'public';

/** Needs a Vercel Blob store and BLOB_READ_WRITE_TOKEN. Writes use the ETag to detect races. */
export function blobStore(pathname = 'data.json') {
  const sdk = import('@vercel/blob');

  async function load() {
    const { get } = await sdk;
    const res = await get(pathname, { access: ACCESS, useCache: false });
    if (!res || res.statusCode !== 200) return { db: empty(), etag: undefined };
    const text = await new Response(res.stream).text();
    return { db: normalize(JSON.parse(text)), etag: res.blob.etag };
  }

  async function read() {
    return (await load()).db;
  }

  async function mutate(fn) {
    const { put, BlobPreconditionFailedError } = await sdk;
    for (let attempt = 0; attempt < 6; attempt++) {
      const { db, etag } = await load();
      const result = await fn(db);
      try {
        await put(pathname, JSON.stringify(db), {
          access: ACCESS,
          contentType: 'application/json',
          addRandomSuffix: false,
          allowOverwrite: true,
          ifMatch: etag,
        });
        return result;
      } catch (e) {
        if (!(e instanceof BlobPreconditionFailedError)) throw e; // someone else wrote first: retry
      }
    }
    throw Object.assign(new Error('Busy, please retry'), { status: 503 });
  }

  return { read, mutate };
}
