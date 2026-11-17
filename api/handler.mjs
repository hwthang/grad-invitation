// Vercel serverless entry for every /api/* request (see the rewrite in vercel.json).
// Data lives in a Vercel Blob store.
import { createApi } from '../server/api.mjs';
import { blobStore } from '../server/stores.mjs';

const api = createApi(blobStore());

export default function handler(req, res) {
  const incoming = new URL(req.url, 'http://localhost');
  // vercel.json passes the original sub-path as ?__path=; fall back to the URL itself.
  const sub = incoming.searchParams.get('__path');
  const url = sub === null ? incoming : new URL(`/api/${sub}`, 'http://localhost');
  return api(req, res, url);
}
