# Kitsune Studio

Premium website design and development for ambitious brands.

Kitsune Studio builds landing pages, multi-page business websites, and website redesigns with a cinematic visual style focused on clarity, craft, performance, and accessibility.

## What's in this repository

- `index.html` — responsive, standalone portfolio website with CSS motion and interactive concept case-study modals.
- `kitsune-mark.svg` — orange fox and violet star brand mark.
- `README.md` — project and deployment notes.
- `robots.txt` and `sitemap.xml` — crawler guidance and public page URLs.
- `404.html` — branded not-found page.
- `og-image.svg` — social-sharing preview graphic.

This version is intentionally a static site, so it can be deployed without a framework build or paid website-builder credits.

## Portfolio principles

- Keep the visual identity minimal, cinematic, and responsive.
- Label speculative portfolio work clearly as **concept projects**.
- Do not invent testimonials, client relationships, or performance results.
- Prioritize semantic HTML, keyboard access, reduced-motion preferences, and SEO metadata.

## Services

- Landing pages
- Multi-page business websites
- Website redesigns

## Deploy with Cloudflare Pages

1. Open Cloudflare Dashboard → **Workers & Pages**.
2. Choose **Create application** → **Pages** → **Connect to Git**.
3. Select `kpuneet1004-netizen/kitsune-studio`.
4. Use these settings for this static version:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** leave blank
   - **Build output directory:** `.`
5. Save and deploy. Future commits to `main` should trigger a new deployment.

After deployment, verify the public URL, mobile layout, project modals, keyboard navigation, metadata, and contact links.

## Before launch

- **Verify contact before launch:** `hello@kitsunestudio.design` is the existing configured destination, but mailbox ownership, receipt, and deliverability have not been verified. Replace it in all HTML files if it is not the studio's real, monitored inbox.
- Canonical URLs and sitemap currently use `https://kitsune-studio-7ix.pages.dev`. Update them if a custom domain becomes the primary domain.
- `og-image.svg` is a custom social preview graphic; test how major platforms render it and export PNG/JPG if SVG previews are unsupported.
- Connect a custom domain if desired.
- Test all navigation, project case studies, and contact actions.
- Verify accessibility and responsive layouts.

## Concept disclaimer

FORMA Objects, NOIR Atelier, and ORBIT Finance are fictional portfolio concepts. The page explicitly labels them as concepts; the illustrative mockups are not live client projects and make no claims about real business results.
