// Shared Vercel function handler. Each file under api/ re-exports this; the URL path is the
// original request path, so one router (api.mjs) serves them all. Data lives in a Vercel Blob.
import { createApi } from './api.mjs';
import { blobStore } from './stores.mjs';

const api = createApi(blobStore());

export default function handler(req, res) {
  return api(req, res, new URL(req.url, 'http://localhost'));
}
