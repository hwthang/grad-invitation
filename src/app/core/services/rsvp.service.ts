import { Injectable, signal } from '@angular/core';
import { RSVPResponse, RSVPStatus, RSVPStorage } from '../models/rsvp.model';

export const RSVP_STORAGE_KEY = 'graduation-invitation-rsvp';

const VALID_STATUSES: RSVPStatus[] = ['PENDING', 'ATTENDING', 'NOT_ATTENDING'];

@Injectable({ providedIn: 'root' })
export class RsvpService {
  private readonly store = signal<RSVPStorage>(this.read());

  /** Reactive: reading inside computed()/effect() tracks changes. */
  getResponse(guestId: string): RSVPResponse | undefined {
    return this.store()[guestId];
  }

  /** No stored response means PENDING, never "declined". */
  getStatus(guestId: string): RSVPStatus {
    return this.getResponse(guestId)?.status ?? 'PENDING';
  }

  save(guestId: string, guestName: string, status: RSVPStatus): void {
    const next: RSVPStorage = {
      ...this.store(),
      [guestId]: { guestId, guestName, status, updatedAt: new Date().toISOString() },
    };
    this.store.set(next);
    this.write(next);
  }

  private read(): RSVPStorage {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) ?? '{}');
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};

      const valid: RSVPStorage = {};
      for (const [id, entry] of Object.entries(parsed)) {
        const e = entry as Partial<RSVPResponse> | null;
        if (e && typeof e.guestName === 'string' && VALID_STATUSES.includes(e.status as RSVPStatus)) {
          valid[id] = {
            guestId: id,
            guestName: e.guestName,
            status: e.status as RSVPStatus,
            updatedAt: typeof e.updatedAt === 'string' ? e.updatedAt : '',
          };
        }
      }
      return valid;
    } catch {
      return {};
    }
  }

  private write(data: RSVPStorage): void {
    try {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable (private mode / quota): keep the in-memory state only.
    }
  }
}
