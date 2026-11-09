import { Injectable } from '@angular/core';
import { defaultGuest, guestMap } from '../config/guests.config';
import { Guest } from '../models/guest.model';
import { normalizeName } from '../utils/normalize-name';

@Injectable({ providedIn: 'root' })
export class GuestService {
  /** normalized name or alias -> guest */
  private readonly nameIndex = new Map<string, Guest>();

  constructor() {
    for (const guest of Object.values(guestMap)) {
      for (const label of [guest.name, ...(guest.aliases ?? [])]) {
        const key = normalizeName(label);
        if (key && !this.nameIndex.has(key)) this.nameIndex.set(key, guest);
      }
    }
  }

  /** Exact normalized match on name or alias; undefined when nothing matches. */
  findByName(name: string): Guest | undefined {
    return this.nameIndex.get(normalizeName(name));
  }

  /** Resolves a guest id; missing or invalid ids fall back to the default guest. */
  getById(id: string | null | undefined): Guest {
    return (id && Object.hasOwn(guestMap, id) ? guestMap[id] : undefined) ?? defaultGuest;
  }

  getDefault(): Guest {
    return defaultGuest;
  }
}
