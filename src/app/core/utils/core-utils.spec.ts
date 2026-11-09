import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { defaultInvitation } from '../config/default-invitation.config';
import { GuestService } from '../services/guest.service';
import { InvitationService } from '../services/invitation.service';
import { deepMerge } from './deep-merge';
import { normalizeName } from './normalize-name';

describe('normalizeName', () => {
  it('lowercases, strips diacritics, maps đ and collapses whitespace', () => {
    expect(normalizeName('  Nguyễn   Văn  Đức ')).toBe('nguyen van duc');
  });
});

describe('deepMerge', () => {
  const base = { a: { x: 'base', y: 'base' }, list: [1, 2], keep: 'k' };

  it('merges nested objects and preserves omitted fields', () => {
    const merged = deepMerge(base, { a: { x: 'over' } });
    expect(merged.a).toEqual({ x: 'over', y: 'base' });
    expect(merged.keep).toBe('k');
  });

  it('replaces arrays entirely, including with an empty array', () => {
    expect(deepMerge(base, { list: [9] }).list).toEqual([9]);
    expect(deepMerge(base, { list: [] }).list).toEqual([]);
  });

  it('does not mutate its inputs or share references', () => {
    const snapshot = structuredClone(base);
    const merged = deepMerge(base, { a: { x: 'over' } });
    expect(base).toEqual(snapshot);
    expect(merged.list).not.toBe(base.list);
  });
});

describe('GuestService', () => {
  const service = new GuestService();

  it('matches by name and alias with normalization', () => {
    expect(service.findByName('nguyen van a')?.id).toBe('guest-001');
    expect(service.findByName('  VĂN   A ')?.id).toBe('guest-001');
  });

  it('does not substring-match', () => {
    expect(service.findByName('nguyen')).toBeUndefined();
  });

  it('falls back to the default guest for missing or invalid ids', () => {
    expect(service.getById(null).id).toBe('guest');
    expect(service.getById('nope').id).toBe('guest');
    expect(service.getById('__proto__').id).toBe('guest');
    expect(service.getById('guest-002').id).toBe('guest-002');
  });
});

describe('InvitationService', () => {
  const service = TestBed.runInInjectionContext(() => new InvitationService());

  it('inherits defaults for omitted fields and overrides provided ones', () => {
    const { content } = service.resolve('guest-001');
    expect(content.hero.greeting).toBe('Gửi A,');
    expect(content.hero.subtitle).toBe(defaultInvitation.hero.subtitle);
    expect(content.gallery.images).toEqual(defaultInvitation.gallery.images);
  });

  it('resolves invalid ids to the default guest invitation and an image', () => {
    const resolved = service.resolve('unknown');
    expect(resolved.guest.id).toBe('guest');
    expect(resolved.image).toBeTruthy();
  });

  it('falls back to the default image when the guest has none', () => {
    expect(service.resolve('guest-002').image).toBe('/assets/images/default-guest.svg');
  });
});

describe('gallery override', () => {

  it('keeps an explicitly empty gallery', () => {
    const merged = deepMerge(defaultInvitation, { gallery: { images: [] } });
    expect(merged.gallery.images).toEqual([]);
    expect(defaultInvitation.gallery.images.length).toBeGreaterThan(0);
  });
});
