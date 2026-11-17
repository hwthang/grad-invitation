// Shared Vercel function handler. Each file under api/ re-exports this; the URL path is the
// original request path, so one router (api.mjs) serves them all.
import { createApi } from './api.mjs';
import { InvitationService } from './invitation.service.mjs';

const api = createApi(InvitationService.fromEnv());

export default function handler(req, res) {
  return api(req, res, new URL(req.url, 'http://localhost'));
}
