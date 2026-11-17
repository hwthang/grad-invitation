// Vercel serverless entry: every /api/* request. Data lives in a private Vercel Blob.
import { createApi } from '../server/api.mjs';
import { blobStore } from '../server/stores.mjs';

const api = createApi(blobStore());

export default function handler(req, res) {
  return api(req, res, new URL(req.url, 'http://localhost'));
}
