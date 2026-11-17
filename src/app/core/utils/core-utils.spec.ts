import { describe, expect, it } from 'vitest';
import { defaultInvitation } from '../config/default-invitation.config';
import { Invitation } from '../models/invitation.model';
import { InvitationService } from '../services/invitation.service';
import { deepMerge } from './deep-merge';
import { rsvpToCsv } from './export-rsvp';
import { normalizeName } from './normalize-name';
import { KEY_PATTERN, slugify } from './slugify';

const invitation = (over: Partial<Invitation> = {}): Invitation => ({
  key: 'a',
  name: 'A',
  theme: 'blue',
  content: {},
  rsvp: { status: 'PENDING', updatedAt: '' },
  ...over,
});

describe('normalizeName / slugify', () => {
  it('strips diacritics, maps đ and collapses whitespace', () => {
    expect(normalizeName('  Nguyễn   Văn  Đức ')).toBe('nguyen van duc');
  });

  it('builds URL-safe keys', () => {
    expect(slugify('Nguyễn Thị Thanh Hằng')).toBe('nguyen-thi-thanh-hang');
    expect(slugify('  A / B!! ')).toBe('a-b');
    expect(KEY_PATTERN.test(slugify('Đặng Văn #1'))).toBe(true);
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

describe('InvitationService', () => {
  const service = new InvitationService();

  it('inherits defaults for omitted fields and overrides provided ones', () => {
    const { content } = service.resolve(invitation({ content: { hero: { greeting: 'Gửi A,' } } }));
    expect(content.hero.greeting).toBe('Gửi A,');
    expect(content.hero.message).toBe(defaultInvitation.hero.message);
    expect(content.gallery.images).toEqual([]);
  });

  it('words the default text for the chosen form of address', () => {
    expect(service.resolve(invitation()).content.hero.greeting).toBe('Thân gửi bạn,');
    const anh = service.resolve(invitation({ address: 'anh' })).content;
    expect(anh.hero.greeting).toBe('Thân gửi anh,');
    expect(anh.hero.message).toBe('Em trân trọng mời anh đến dự lễ tốt nghiệp của em.');
    expect(anh.rsvp.attendingButton).toBe('Anh sẽ đến!');
    expect(service.resolve(invitation({ address: 'em' })).content.hero.message).toContain('Anh trân trọng mời em');
  });

  it('uses the guest avatar, else the themed placeholder', () => {
    expect(service.resolve(invitation({ avatar: 'data:image/jpeg;base64,xx' })).avatar).toBe('data:image/jpeg;base64,xx');
    expect(service.resolve(invitation()).avatar).toBe('/assets/images/default-guest.svg');
    expect(service.resolve(invitation({ theme: 'pink' })).avatar).toBe('/assets/images/default-guest.pink.svg');
  });
});

describe('rsvpToCsv', () => {
  it('lists attendees first, quotes cells and starts with a BOM', () => {
    const csv = rsvpToCsv([
      invitation({ key: 'b', name: 'B "Bo"', rsvp: { status: 'NOT_ATTENDING', updatedAt: 't' } }),
      invitation({ key: 'a', name: 'A', rsvp: { status: 'ATTENDING', updatedAt: 't' } }),
      invitation({ key: 'c', name: 'C' }),
    ]);
    const lines = csv.slice(1).split('\r\n');
    expect(csv.startsWith('﻿')).toBe(true);
    expect(lines[1]).toContain('"Tham gia"');
    expect(lines[2]).toContain('"B ""Bo"""');
    expect(lines[3]).toContain('"Chưa phản hồi"');
  });
});
