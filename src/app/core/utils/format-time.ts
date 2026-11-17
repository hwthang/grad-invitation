/** "16:00" -> "4h chiều", "09:30" -> "9h30 sáng". Returns the input unchanged if it is not HH:mm. */
export function formatVnTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return time;

  const period = hour === 0 ? 'đêm' : hour <= 10 ? 'sáng' : hour <= 12 ? 'trưa' : hour <= 17 ? 'chiều' : 'tối';
  const h12 = hour % 12 || 12;
  return `${h12}h${minute ? String(minute).padStart(2, '0') : ''} ${period}`;
}
