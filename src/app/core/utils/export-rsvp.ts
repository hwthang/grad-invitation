import { Invitation, RSVPStatus } from '../models/invitation.model';

export const STATUS_LABEL: Record<RSVPStatus, string> = {
  PENDING: 'Chưa phản hồi',
  ATTENDING: 'Tham gia',
  NOT_ATTENDING: 'Không tham gia',
};

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** CSV (UTF-8 with BOM so Excel reads Vietnamese correctly) of every guest and their answer. */
export function rsvpToCsv(invitations: readonly Invitation[]): string {
  const order: Record<RSVPStatus, number> = { ATTENDING: 0, NOT_ATTENDING: 1, PENDING: 2 };
  const rows = [...invitations]
    .sort((a, b) => order[a.rsvp.status] - order[b.rsvp.status] || a.name.localeCompare(b.name, 'vi'))
    .map((i) => [i.name, STATUS_LABEL[i.rsvp.status], i.rsvp.updatedAt, i.key].map(cell).join(','));
  return '﻿' + [['Tên', 'Phản hồi', 'Cập nhật lúc', 'Key'].map(cell).join(','), ...rows].join('\r\n');
}

export function downloadText(filename: string, text: string, type = 'text/csv;charset=utf-8'): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** JSON list of every guest and their answer (no avatars or page content). */
export function rsvpToJson(invitations: readonly Invitation[]): string {
  const list = invitations.map((i) => ({ key: i.key, name: i.name, status: i.rsvp.status, updatedAt: i.rsvp.updatedAt }));
  return JSON.stringify(list, null, 2);
}
