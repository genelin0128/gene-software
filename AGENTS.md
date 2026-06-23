# gene-software Agent Guide

This is a public personal portfolio repository. Keep changes small, visible, and
safe to publish.

## Operating Rules

- Use `pnpm` only.
- Do not commit directly to `main`; use `codex/<short-description>` branches.
- Prefer the existing Next.js App Router, TypeScript, Tailwind, Three.js, and
  Motion stack before adding dependencies.
- Read the current files before editing. Reuse existing components and assets
  unless replacing them clearly reduces complexity or improves consistency.
- Follow a Ponytail-style bias: understand the task, remove unnecessary work,
  choose the smallest durable implementation, and avoid speculative
  abstractions.

## Public Repo Safety

- Never copy tokens, API keys, private `.env` files, cloud credentials, cookies,
  or paid-service secrets from another project into this repository.
- Motion Studio or other paid tooling must be configured through local
  environment variables only. Use names such as `MOTION_TOKEN`; never commit the
  value.
- Keep `.env*` ignored. If a variable must be documented, add an
  `.env.example`-style file with placeholder values.
- Before publishing, search for obvious secret patterns and verify generated
  screenshots or PDFs do not reveal private data.

## Portfolio Design Direction

- Treat the resume as the source of truth for content: Ching Yao Lin / Gene Lin,
  Rice MCS, Paycom, SXB, GatherPoint AI, Poker analytics, Travel itinerary, and
  the technical skills listed in `apps/web/public/resume/resume.pdf`.
- Design for recruiters and engineering managers scanning quickly. Lead with
  role fit, project systems, shipped workflows, and the downloadable resume.
- Keep the visual system consistent: neutral base, restrained accent colors,
  readable type, 8px-or-less card radius, clear sections, and project imagery
  that shows real work.
- Use Motion for React from `motion/react` in client components. Prefer
  compositor-friendly opacity and transform animations. Avoid local animation
  one-offs when a shared pattern already exists.
- Do not add generic decorative gradient orbs, oversized marketing heroes, or
  nested cards. The first screen should be the portfolio itself, not a landing
  page pitch.

## Verification

- Run `pnpm -F web typecheck` after TypeScript changes.
- Run `pnpm -F web build` before handing off UI changes when feasible.
- For visible UI changes, run the app locally and inspect desktop and mobile
  widths for blank canvases, broken images, overlap, and text overflow.
