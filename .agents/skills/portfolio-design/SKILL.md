---
name: portfolio-design
description: >
  Portfolio UI consistency workflow for gene-software. Use when changing the
  homepage, project cards, resume-driven copy, imagery, responsive layout, or
  Motion animation.
argument-hint: "[portfolio UI task]"
---

## Goal

Make the portfolio feel like one intentional product surface for recruiters and
engineering managers, using the latest resume as content source of truth.

## Required Context

- Read `AGENTS.md`.
- Read the files you plan to edit before designing.
- Check `apps/web/public/resume/resume.pdf` or its source text before changing
  roles, projects, education, or skills.

## Design Checks

- First viewport shows Ching Yao Lin / Gene Lin, new grad software engineer,
  Rice MCS, location, core technical direction, and resume download.
- Project order should reflect current resume priority:
  GatherPoint AI, iOS Poker Session Tracking & Analytics App, AI Travel
  Itinerary Recommendation Platform, then supporting/older projects if used.
- Use real available visual assets: avatar, project screenshots, or public-safe
  product images. Do not invent screenshots that misrepresent a project.
- Keep cards at 8px radius or less and avoid cards nested inside cards.
- Keep the palette balanced. Do not default to one-hue neon, purple-blue AI
  glow, beige luxury, or dark slate-only styling.
- Motion should support scanning: entrance, hover, scroll progress, subtle 3D or
  kinetic type. Avoid animations that move layout or make text hard to read.
- Text must fit on mobile and desktop. Verify long project and company names do
  not overflow.

## Implementation

- Use `motion/react` for React animation imports.
- Prefer `transform` and opacity animations; use springs for hover/press or
  interruptible movement.
- Reuse data arrays and local helper components before adding shared
  abstractions. Extract only when two or more places benefit.
- Keep user-facing copy concrete and resume-backed.

## Verification

- Run `pnpm -F web typecheck`.
- Run `pnpm -F web build` when the change is visible or deploy-facing.
- Inspect desktop and mobile layouts with the local dev server before final
  handoff when feasible.
