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

### 2026-10-05 — Angular Material chosen
`@angular/material@^22.2.1` and `@angular/cdk@^22.2.1` added. Used for icons (`MatIconModule`) and tooltips (`MatTooltipModule`). No other component library needed.

### 2026-10-05 — Auth strategy: mock in-memory service
`AuthService` uses signals and a hardcoded user map. Two demo accounts: `student@demo.com / demo123` and `parent@demo.com / demo123`. Route guard (`authGuard`) redirects unauthenticated users to `/auth/sign-in`. Role stored on the user object (`student` | `parent`) drives which nav and dashboard is shown.

### 2026-10-05 — State management: signals only
No NgRx, no BehaviorSubject. All service state uses Angular signals. `computed()` for derived state. This applies to AI chat services, auth, and all future features.

### 2026-10-05 — Dashboard layout: full-width, no max-width cap
Both student and parent `.page` containers use `padding: 32px` only — no `max-width` or `margin: 0 auto`. Content stretches edge-to-edge within the `.main` area at all viewport widths.

### 2026-10-05 — AI chat architecture: component-scoped service via DI token
Parent and student AI chat pages each have their own service (`ParentAiChatService`, `StudentAiChatService`) provided as `AiChatService` in the component's `providers` array. This lets the existing `AiChatMessagesComponent` and `AiChatInputComponent` work without modification while each dashboard gets isolated, context-aware conversation state.

### 2026-10-05 — Deployed to Vercel via GitHub integration
Repo: `github.com/shifttechgs/zaki-ai`, branch: `main`. Auto-deploys on push. Deployment protection disabled (public access). Fix required: `@angular/animations` must stay at `^22.0.0` — it was incorrectly at `^20.1.8` which caused `ERESOLVE` on Vercel's `npm install`.

---

## Constraints

- `@angular/animations` must be `^22.0.0`. It was accidentally set to `^20.1.8` and caused Vercel build failures. Never downgrade it independently of the other Angular packages.

---

## Open questions

- [ ] Auth strategy — replace mock with real backend (JWT, OAuth, Supabase Auth)?
- [ ] State management — keep signals-only or introduce a store pattern for cross-component shared state?
- [ ] AI backend — replace mock `setTimeout` responses with real API calls (Anthropic, OpenAI)?

---

## How to use this file

- When a non-obvious decision is made, add an entry under **Decisions** with the date and the reasoning.
- When a hard external constraint is discovered, add it under **Constraints**.
- When a question is resolved, move it from **Open questions** to **Decisions**.
- Do not record things that are obvious from reading the code or git log.
