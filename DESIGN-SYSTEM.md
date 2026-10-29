# Kitsune Studio Design System

Version 1.1 · Canonical tokens wired into the live site stylesheet stack.

## Brand direction
Dark editorial base, fox-orange as the primary action color, star-purple as the secondary accent, high-contrast typography, subtle borders, generous spacing, and responsive card layouts.

## Color tokens
| Token | Value | Role |
|---|---|---|
| Brand orange | `#FF6500` | Primary CTA, focus/active accents |
| Brand purple | `#9B35FF` | Star accent, secondary highlights |
| Background | `#0B0B0E` | Main canvas |
| Surface | `#111116` | Cards and panels |
| Raised surface | `#17171E` | Secondary panels |
| Primary text | `#F6F3EF` | Main text |
| Muted text | `#AAA7B1` | Supporting text |
| Border | `#292830` | Dividers and card edges |

## Typography
- UI/body: DM Sans
- Utility/metadata: DM Mono
- Headings: DM Sans with tight tracking and responsive clamp sizing
- Body copy should remain comfortably readable; mono uppercase labels are for metadata only.

## Layout
- Content max width: 1180px
- Responsive page gutter: `clamp(20px, 4vw, 48px)`
- Spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64px
- Use the existing responsive breakpoints and component layout rules in `styles.css`.

## Components
- Sticky translucent header with navigation
- Brand lockup using the fox logo
- Primary and secondary CTA links
- Responsive cards and concept showcases
- Inquiry flow and accessible focus/skip-link styles
- Reduced-motion-aware reveal effects

## Implementation
- `tokens.css` is loaded before `styles.css` from `index.html`.
- Existing site styling remains authoritative for established components; the `--ks-*` variables provide a stable design-system API for future sections and refactors.
- The current repository is already configured for Cloudflare Pages; commits to `main` should trigger a deployment when the Pages Git integration is active.

## Release checks still required
Verify contrast against WCAG 2.2 AA, test keyboard navigation and forms, check responsive layouts on real devices, confirm the inquiry inbox is monitored, and inspect the Cloudflare Pages deployment result.
