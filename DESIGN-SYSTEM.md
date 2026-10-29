# Kitsune Studio Design System

Version 2.0 — canonical system for the rebuilt site.

## Brand direction

A dark editorial base with a confident fox-orange primary action, star-purple secondary accent, high-contrast typography, subtle borders, responsive compositions, and motion used with restraint. The brand should feel crafted and distinctive without sacrificing clarity or usability.

## Color tokens

| Token | Value | Role |
|---|---|---|
| Brand orange | `#FF6500` | Primary actions, active states, focus accents |
| Brand purple | `#9B35FF` | Secondary accent, expressive highlights |
| Background | `#0B0B0E` | Main canvas |
| Surface | `#111116` | Section and card surfaces |
| Raised surface | `#17171E` | Elevated cards and panels |
| Primary text | `#F6F3EF` | Main text |
| Muted text | `#AAA7B1` | Supporting text |
| Border | `#292830` | Dividers and card edges |

## Typography

- Body and display: DM Sans.
- Metadata and labels: DM Mono.
- Headings use tight tracking and responsive `clamp()` sizing.
- Body copy should remain readable and concise; mono uppercase labels are reserved for metadata.

## Layout and spacing

- Content max width: 1180px.
- Responsive gutter: `clamp(20px, 4vw, 48px)`.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Radii: 8, 14, and 22px.
- Mobile-first responsive adjustments; avoid horizontal overflow.

## Components

- Sticky translucent navigation and fox brand lockup.
- High-contrast primary and outlined secondary CTAs.
- Editorial hero with animated emblem/orbits.
- Bento-style project concepts.
- Belief statements, visual-style selector, service cards, and process grid.
- Accessible enquiry form with an email-draft handoff.
- Visible focus indicators, skip link, semantic landmarks, and reduced-motion support.

## Implementation rules

- `tokens.css` is loaded before `styles.css`.
- Use `--ks-*` variables as the canonical design-system API.
- Keep JavaScript dependency-free and progressively enhance interactions.
- Avoid presenting illustrative concepts as commissioned client work or claiming unmeasured outcomes.
- The form opens an email draft; it is not a backend submission endpoint.

## Release checks

Verify WCAG 2.2 AA contrast, keyboard navigation, form validation, mobile layouts, reduced-motion behavior, external font/image behavior, monitored enquiry inbox, and Cloudflare Pages deployment.
