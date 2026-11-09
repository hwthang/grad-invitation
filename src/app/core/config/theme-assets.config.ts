import { GuestTheme } from '../models/guest.model';

/**
 * Placeholder images are plain <img> files and cannot read CSS variables, so each themed
 * placeholder has its own variant. Real photos are not listed here and are never swapped.
 */
const PLACEHOLDER_VARIANTS: Record<string, Partial<Record<GuestTheme, string>>> = {
  '/assets/images/default-guest.svg': { pink: '/assets/images/default-guest.pink.svg' },
  '/assets/images/graduate/portrait.svg': { pink: '/assets/images/graduate/portrait.pink.svg' },
};

/** Returns the theme's variant of a placeholder image, or the path unchanged. */
export function themedAsset(path: string, theme: GuestTheme): string {
  return PLACEHOLDER_VARIANTS[path]?.[theme] ?? path;
}

/** Firework burst colors per theme. */
export const FIREWORK_COLORS: Record<GuestTheme, readonly string[]> = {
  blue: ['#2563EB', '#60A5FA', '#A7C7E7', '#FFFFFF', '#FACC15'],
  pink: ['#DB2777', '#F472B6', '#F9A8D4', '#FFFFFF', '#FACC15'],
};
