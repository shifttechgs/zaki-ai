# Zaki Portal — Docs

Angular 22 · TypeScript 6 · SCSS · Vitest

## Contents

| File | Purpose |
|---|---|
| [angular-best-practices.md](./angular-best-practices.md) | Coding standards, component patterns, and Angular 22 conventions |
| [anti-ai-design.md](./anti-ai-design.md) | Rules for rejecting AI-generated patterns that hurt this codebase |
| [design-ai-chat.md](./design-ai-chat.md) | Full design spec for the AI Chat page (layout, tokens, components, a11y) |
| [memory.md](./memory.md) | Running log of decisions, constraints, and project context |

## Quick rules

1. Standalone components only — no `NgModule`.
2. Signals for state, not BehaviorSubjects.
3. `inject()` for DI, not constructor injection.
4. No comments that restate what the code already says.
5. No AI-added abstractions unless the use case repeats 3+ times.
