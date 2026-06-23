---
name: public-repo-readiness
description: >
  Public repository safety and readiness workflow for gene-software. Use before
  staging, committing, pushing, or copying AI/tooling settings from another
  project.
argument-hint: "[readiness or safety task]"
---

## Goal

Keep this portfolio repository safe to publish while preserving a useful agent
workflow for future contributors.

## Checklist

- Confirm no secrets, tokens, private keys, cookies, local credentials, or paid
  tool keys were copied into source, docs, images, PDFs, or examples.
- Keep real `.env*` files ignored. Document required variables with placeholder
  values in `.env.example` files only.
- Search for common secret patterns before publishing:

```sh
rg -n 'AKIA|ASIA|sk-[A-Za-z0-9]|OPENAI|AZURE|MOTION_TOKEN|TOKEN|SECRET|PASSWORD|PRIVATE KEY|api[_-]?key|client[_-]?secret' .
```

- Treat public contact endpoints as public. Prefer mailto links unless the API
  has rate limits, abuse controls, and deployment docs.
- Do not copy full private-project rulebooks into this repo. Distill only the
  parts that apply to a static public portfolio.
- Check `git diff --stat` and `git diff` before handoff so generated files,
  scratch notes, and accidental binary changes are intentional.

## Verification

- Run the relevant `pnpm` checks.
- If a generated or copied asset is added, verify it is public-safe and does not
  expose private data.
