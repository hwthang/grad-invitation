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
