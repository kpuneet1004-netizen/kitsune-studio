# Kitsune Studio

A clean rebuild of the Kitsune Studio website, implemented from the canonical design system with semantic HTML, responsive CSS, and lightweight vanilla JavaScript.

## Source of truth

- `index.html` — homepage structure, clickable concept cards, style selector, services, pricing, and enquiry form
- `case-study-northline.html`, `case-study-ar.html`, `case-study-profile.html` — three standalone, consistently structured concept case studies
- `case-studies.css` — shared responsive case-study layout and preview styling
- `tokens.css` — canonical colors, typography, spacing, radii, and content width
- `styles.css` — rebuilt responsive component and layout styling; all design decisions reference the `--ks-*` tokens
- `script.js` — accessible mobile navigation, visual direction selection, enquiry prefill, and email-draft handoff
- `sitemap.xml` — homepage and case-study URLs
- `DESIGN-SYSTEM.md` — brand rules and implementation guidance
- `kitsune-logo.svg` / `kitsune-mark.svg` — brand marks
- `social-preview.svg` / `og-image.svg` — social sharing artwork

## Design direction

Dark editorial canvas, fox-orange primary actions, purple secondary accents, DM Sans and DM Mono typography, considered spacing, crisp borders, and expressive typographic project mockups.

## Deployment

The repository is configured for Cloudflare Pages. Commits to `main` should trigger a deployment if the existing Pages Git integration remains active.

Production URL: https://kitsune-studio-7ix.pages.dev/

## Important behavior

The project enquiry form opens a pre-filled email draft to `hello@kitsunestudio.design`; it does not submit to a backend or store data. Confirm that the inbox is monitored before promoting the site. All three case studies are illustrative concept studies, not commissioned client work or claims of measured client outcomes. Current service pricing: resume / portfolio ₹4,999; landing page ₹9,999; business websites custom-quoted according to required page count and scope.

## Release checklist

- Verify the Cloudflare Pages deployment and inspect the live site.
- Test the layout at phone, tablet, and desktop widths.
- Test keyboard navigation, focus states, reduced motion, and form validation.
- Verify contrast and confirm the enquiry inbox is monitored.
