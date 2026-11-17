import { normalizeName } from './normalize-name';

/** URL-safe key from a name: "Nguyễn Văn A" -> "nguyen-van-a". */
export function slugify(value: string): string {
  return normalizeName(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export const KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,59}$/;
