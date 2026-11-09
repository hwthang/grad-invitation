# SRS Changelog

## v2.1 — implementation notes

Deviations / additions made while implementing v2.1 (the SRS text itself is unchanged):

- **Assets location:** Angular 22 serves static files from `public/`, so the Welcome config lives at
  `public/assets/config/welcome-content.json` (served at `/assets/config/welcome-content.json`)
  instead of `src/assets/config/`. The same applies to `public/assets/images/**`.
- **Placeholder images:** `.svg` placeholders are used instead of `.jpg` until real photos are added.
- **Extra label fields:** every user-facing string must be configurable (SRS 4.1), so `InvitationContent`
  gained optional label fields not listed in 8.2:
  - `profile.universityLabel`, `profile.majorLabel`, `profile.yearLabel`
  - `event.dateLabel`, `event.timeLabel`, `event.locationLabel`, `event.calendarButtonLabel`
  - `gallery.closeLabel`, `gallery.previousLabel`, `gallery.nextLabel`
  - `rsvp.changeButton`
- **Add to Calendar (FR-21):** implemented as a Google Calendar template link (3-hour default duration).
- **Placeholder data:** graduate, university, venue and guest data are sample values to be replaced.
- **Route `/welcome`:** legacy path redirects to `/`.

## v2.1 — gallery default

- The default gallery is **empty** (`gallery.images: []`). The Gallery section renders only when the resolved
  invitation has at least one image, so it is hidden unless a guest defines `invitation.gallery.images`.
  This narrows 7.4 ("use the default gallery"): the default gallery now has no images.

## v2.1 — per-guest theme

- `Guest` gained an optional `theme?: 'blue' | 'pink'` (default `blue`). The Invitation page sets
  `data-theme` on its root element and `src/styles/theme.css` overrides the `--color-*` tokens for that theme.
  The Welcome page always uses the default blue theme because the guest is not known yet.
- To add a theme: add a value to `GuestTheme` and a matching `[data-theme='...']` block in `theme.css`.

## v2.1 — welcome flow and favicon

- Removed the Welcome "not found" message (`validation.notFound`, SRS 5.3/5.4). An unknown name now goes straight
  to the default invitation with no delay; the key was removed from `welcome-content.json` and `WelcomeContent`.
- Replaced the default Angular favicon with `public/favicon.svg` (graduation cap, blue).

## v2.1 — fireworks

- The Invitation page plays a one-shot fireworks animation on entry (`shared/components/fireworks`).
  Canvas-based, no extra dependency, colors per theme (`FIREWORK_COLORS` in `theme-assets.config.ts`).
  It ignores pointer events, removes itself when finished, and is skipped under `prefers-reduced-motion`.
