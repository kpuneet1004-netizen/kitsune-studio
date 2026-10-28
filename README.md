# Kitsune Studio

A motion-led, responsive website for an independent digital design studio.

## Experience
- Brief fox-power intro with skip control, session-aware replay, and reduced-motion support
- Responsive hero and bento-style concept project gallery
- Interactive business-category website previews: Commerce, Luxury, and SaaS / Fintech
- Studio positioning, services, process, honest testimonials policy, contact CTA, and footer
- Custom fox identity, semantic HTML, keyboard-friendly tabs, responsive navigation, SEO metadata
- Static HTML/CSS/JavaScript; no framework build step required

## Local preview
Open `index.html` in a browser, or run a local static server:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploy with Cloudflare Pages
The repository is structured as a static website. In Cloudflare Dashboard:

1. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Connect the GitHub repository `kpuneet1004-netizen/kitsune-studio`.
3. Set production branch to `main`.
4. Framework preset: `None`.
5. Build command: leave empty.
6. Build output directory: `/` or `.` (Cloudflare Pages asks for the repository root for this static site).
7. Save and deploy. Future commits to `main` should automatically trigger deployments once Git integration is active.

If the repository is already connected to Cloudflare Pages, the commit to `main` should trigger a new deployment automatically. Check **Workers & Pages → your project → Deployments** for the actual result.

## Before launch
- Confirm `hello@kitsunestudio.design` is an inbox you own and monitor. It is currently used by the contact links; replace it throughout the HTML files if needed.
- Canonical, Open Graph, robots, and sitemap currently use `https://kitsune-studio-7ix.pages.dev`. Update these if a different Cloudflare Pages hostname or a custom domain becomes the primary URL.
- FORMA Objects, NOIR Atelier, and ORBIT Finance are concept explorations, not commissioned client projects.
- No testimonials are fabricated. The testimonials section explains that verified client feedback will be added after real projects ship.
- Review the site on mobile, test the preview tabs and contact links, and verify HTTPS after deployment.

## Key files
- `index.html` — homepage, styles, intro animation and interactions
- `hero-kitsune.svg` — animated-hero fox illustration
- `kitsune-logo.svg`, `kitsune-mark.svg` — brand assets
- `forma-objects.html`, `noir-atelier.html`, `orbit-finance.html` — concept landing pages
- `og-image.svg` — social-sharing image
- `404.html`, `robots.txt`, `sitemap.xml` — supporting static-site files
