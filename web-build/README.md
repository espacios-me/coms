# Imported Dashboard Artifacts (`web-build/`)

This folder preserves static HTML files imported from a **compiled React dashboard build**.

## What these files are

- `index.html`
- `workers.html`
- `github.html`
- `google.html`
- `chat.html`

These files are **build artifacts**, not editable React source files.

## Important limitations

The imported pages originally expected bundle assets that are not included in this repository:

- `/assets/index-WOwI9Sfv.js`
- `/assets/index-BEQw_vQO.css`

Because those files are missing, this folder should be treated as a preserved snapshot/reference, not a runnable app build.

## Relationship to planned product

The imported dashboard appears to be a command-center style web dashboard and is **not the same product shape** as the planned Atom mobile-style app (Atom / Integrations / Panel / Friends).

## Why this folder exists

- Preserve what was imported.
- Document current state honestly.
- Support a clean rebuild from real source code in future phases.
