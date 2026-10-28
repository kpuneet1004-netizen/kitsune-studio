# Kitsune Studio

An independent digital studio website for ambitious brands — built as a fast, responsive static site for Cloudflare Pages.

## The experience

- A cinematic Kitsune intro sequence with a skip control and reduced-motion support.
- A distinct editorial hero with the studio's fox emblem.
- Bento-style concept project showcase.
- Interactive in-page design previews for commerce, luxury, and SaaS/fintech.
- Studio positioning, services, process, honest testimonials section, contact CTA, and footer.
- Responsive navigation, keyboard-operable tabs, social metadata, and static assets.
- No framework or build step required.

## Deploy to Cloudflare Pages

This repository is a static HTML site. The current file layout is the deployment output root.

Recommended Cloudflare Pages settings:
- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `/` (repository root)

Connect this repository in the Cloudflare dashboard at **Workers & Pages → Create → Pages → Connect to Git**. Cloudflare Pages will deploy each push to the production branch automatically.

Official guide: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## Project notes

The FORMA Objects, NOIR Atelier, and ORBIT Finance pages are concept explorations, not paid client case studies. The homepage explicitly identifies them as concepts and intentionally does not invent client testimonials.

Before promoting the site:
1. Replace `hello@kitsunestudio.design` in `index.html` with the real studio contact email.
2. Update canonical and social metadata URLs to the final custom domain once it's connected.
3. Replace the testimonials placeholder with verified testimonials only after projects are delivered.
4. Review all demo project links and copy before launch.
