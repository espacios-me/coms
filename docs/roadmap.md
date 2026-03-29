# Roadmap: Imported Dashboard Artifact -> Atom App Rebuild

## Goal

Move from preserved compiled dashboard artifacts to a clean, maintainable product codebase for the planned Atom mobile-style app.

## Phase 0 — Stabilize repository (now)

- Preserve imported artifact files in `web-build/`.
- Document clearly that artifacts are compiled output, not source.
- Remove ambiguity about missing build assets.

## Phase 1 — Define the real product

- Confirm IA/navigation for core tabs:
  - Atom
  - Integrations
  - Panel
  - Friends
- Write acceptance criteria for each screen.
- Decide data contracts for each tab and backend boundary.

## Phase 2 — Rebuild app shell

- Implement a mobile-first navigation shell in `client/`.
- Set up route-level placeholders for each tab.
- Add shared design tokens and component constraints.

## Phase 3 — Rebuild functional slices

- Build one end-to-end slice at a time (UI + API + persistence).
- Prioritize Integrations and Atom context panel first.
- Add test coverage per slice before adding the next.

## Phase 4 — Retire artifact dependence

- Keep `web-build/` only for historical reference.
- Ensure new source-based flows fully replace any artifact expectations.
- Document migration completion criteria.

## Definition of success

- Product behavior is implemented from maintainable source code.
- Repo no longer depends on missing compiled assets.
- Team can iterate quickly on Atom app features without artifact constraints.
