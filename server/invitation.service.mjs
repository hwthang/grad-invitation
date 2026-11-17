// InvitationService: the one place that talks to MongoDB. The API (api.mjs) calls it directly.
// Config: MONGODB_URI (required), MONGODB_DB (default "grad-invitation").
// Each invitation is one document, `_id` = its URL key. `_v` is a version counter used to
// detect concurrent writes; it never leaves this class.
import { MongoClient } from 'mongodb';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const COLLECTION = 'invitations';
const MAX_RETRIES = 6;

const strip = ({ _id, _v, ...invitation }) => invitation;

export class InvitationService {
  #uri;
  #dbName;

  constructor({ uri, dbName = 'grad-invitation' } = {}) {
    this.#uri = uri;
    this.#dbName = dbName;
  }

  static fromEnv() {
    return new InvitationService({ uri: process.env.MONGODB_URI, dbName: process.env.MONGODB_DB || undefined });
  }

  /** Connects once per process (reused across serverless invocations). */
  async #collection() {
    if (!this.#uri) throw new HttpError(500, 'MONGODB_URI is not set');
    const cache = (globalThis.__gradInvitationMongo ??= new Map());
    const cacheKey = `${this.#uri}|${this.#dbName}`;
    if (!cache.has(cacheKey)) {
      const client = new MongoClient(this.#uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 });
      cache.set(cacheKey, client.connect().then((c) => c.db(this.#dbName).collection(COLLECTION)));
    }
    try {
      return await cache.get(cacheKey);
    } catch (e) {
      cache.delete(cacheKey); // allow a retry on the next request
      throw e;
    }
  }

  async list() {
    const docs = await (await this.#collection()).find().sort({ createdAt: 1 }).toArray();
    return docs.map(strip);
  }

  async get(key) {
    const doc = await (await this.#collection()).findOne({ _id: key });
    return doc ? strip(doc) : null;
  }

  async insert(invitation) {
    try {
      await (await this.#collection()).insertOne({ ...invitation, _id: invitation.key, _v: 0 });
    } catch (e) {
      if (e?.code === 11000) throw new HttpError(409, 'Key already exists');
      throw e;
    }
    return invitation;
  }

  /** Applies `change(invitation)` (pure; may run again on a conflict) and returns the saved document. */
  async update(key, change) {
    const collection = await this.#collection();
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const current = await collection.findOne({ _id: key });
      if (!current) throw new HttpError(404, 'Not found');
      const next = await change(strip(current));
      const version = current._v ?? 0;
      const result = await collection.replaceOne({ _id: key, _v: version }, { ...next, _id: key, _v: version + 1 });
      if (result.matchedCount) return next;
    }
    throw new HttpError(503, 'Busy, please retry');
  }

  async remove(key) {
    const result = await (await this.#collection()).deleteOne({ _id: key });
    if (!result.deletedCount) throw new HttpError(404, 'Not found');
  }
}
