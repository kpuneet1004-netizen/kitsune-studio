# Kitsune Studio Agreement Portal — prototype

This folder contains the first visual prototype for a dedicated client agreement portal intended for `agreements.kitsunestudio.design`.

## Current status

**Prototype only — not production-ready.** The current page is static and illustrative. It does not authenticate users, create or store agreements, send OTPs, collect legally operative signatures, generate PDFs, or write audit records. Do not send this page to clients as an agreement.

## Intended Cloudflare architecture

- **Cloudflare Pages**: serve the portal UI on `agreements.kitsunestudio.design`.
- **Cloudflare Workers**: authenticated API for admin actions, client access, OTP verification, acceptance, PDF finalisation and audit events.
- **Cloudflare D1**: clients, projects, agreement versions, milestones, acceptance events and audit metadata.
- **Cloudflare R2**: private storage for generated agreement PDFs and supporting files.
- **Cloudflare Turnstile**: abuse protection on public client flows.

## Production gates

1. Confirm the Cloudflare account, zone and DNS ownership; create a separate Pages project and map `agreements.kitsunestudio.design`.
2. Provision D1 and R2 with private access; apply a reviewed schema and retention policy.
3. Implement server-side role-based admin access, expiring single-use client tokens, OTP throttling, CSRF/origin controls and audit logging.
4. Integrate a transactional email provider and an India-appropriate e-sign provider if certified electronic signatures are required.
5. Generate the final PDF server-side, hash and retain the exact executed version, and provide both parties with copies.
6. Complete Indian legal review and applicable stamp-duty checks before execution.

Never place API secrets, signing keys, OTP secrets or privileged database credentials in browser JavaScript. Do not use a checkbox or typed name as a substitute for a legally recognised e-signature where one is required.
