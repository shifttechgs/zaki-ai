# Project Memory — Zaki Portal

Running log of decisions, constraints, and context that isn't obvious from the code.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Angular 22 | Standalone components, signals, new control flow |
| Language | TypeScript 6 | `strict: true` always on |
| Styles | SCSS | Component-scoped; global tokens in `styles.scss` |
| Testing | Vitest | No Karma/Jasmine |
| Package manager | npm 11 | `packageManager` field locked in `package.json` |

---

## Decisions

### 2026-10-01 — Project initialised
Angular 22 scaffold created with routing and SCSS. No UI component library chosen yet.

---

## Constraints

_Add hard constraints here as they are discovered — things that cannot be changed without external approval (API contracts, legal, infra limitations)._

---

## Open questions

_Track unresolved decisions here until they are made._

- [ ] UI component library? (options: PrimeNG, Angular Material, custom)
- [ ] Auth strategy? (options: JWT, session cookie, OAuth via backend)
- [ ] State management beyond signals? (NgRx, custom stores, none)

---

## How to use this file

- When a non-obvious decision is made, add an entry under **Decisions** with the date and the reasoning.
- When a hard external constraint is discovered, add it under **Constraints**.
- When a question is resolved, move it from **Open questions** to **Decisions**.
- Do not record things that are obvious from reading the code or git log.
