# espacios-me/coms

## Current repository status

This repository currently contains a **transition-state codebase**:

1. A modern TypeScript/React project scaffold and supporting backend/config files.
2. A preserved `web-build/` folder with imported static dashboard HTML artifacts.

The imported `web-build/` content is retained for reference and provenance, but it is **not a complete runnable build** of the original dashboard.

## What exists today

- Existing app/rebuild workspace under `client/` and project tooling (`package.json`, Vite, TypeScript, Drizzle, Wrangler).
- Imported static dashboard route artifacts in `web-build/`:
  - `index.html`
  - `workers.html`
  - `github.html`
  - `google.html`
  - `chat.html`
- Documentation explaining artifact limitations and intended transition.

## What is missing

The imported dashboard HTML files reference build assets that are not present in this repository:

- `/assets/index-WOwI9Sfv.js`
- `/assets/index-BEQw_vQO.css`

Without those bundles (or original source code), the imported dashboard cannot be restored as-is.

## Product direction (next phase)

The planned product direction is an Atom mobile-style experience (e.g., Atom / Integrations / Panel / Friends), which differs from the imported command-center dashboard artifact.

## Recommended next steps

1. Treat `web-build/` as immutable reference material.
2. Define fresh product requirements for the Atom app screens and navigation.
3. Rebuild the UI from source in `client/` (do not reverse-engineer compiled artifacts).
4. Add a lightweight architecture decision record (ADR) for routing/state/data boundaries.
5. Incrementally ship vertical slices (navigation shell, one integration, panel view, friends view).

See `docs/roadmap.md` for a suggested transition plan.
