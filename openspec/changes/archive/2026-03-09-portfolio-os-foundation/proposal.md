## Why

A personal portfolio that looks like every other developer portfolio is forgettable. Portfolio OS reframes the experience as a retro arcade machine — the visitor is the player, the CV is unlocked by playing a Breakout game. This is the foundational implementation: project setup through all three screens, built from scratch as a learning project.

## What Changes

- Initialize project with TypeScript and a bundler of your choice (Vite + vanilla TS, Next.js, SvelteKit, etc.)
- Implement full design system via CSS custom properties (both dark and light themes)
- Build persistent outer chrome: top bar and footer, identical across all screens
- Build INSERT COIN attract screen — 3-screen idle cycle with animations
- Build PLAY MODE — working Breakout game where breaking brick rows unlocks CV sections
- Build CV LIST MODE — terminal-style CV viewer with sidebar navigation
- Wire all screens into a single-page state machine with CRT theme toggle

## Capabilities

### New Capabilities

- `design-system`: CSS custom property tokens, typography scale, spacing system, and all animation keyframes used across all screens. References `docs/design-system.md` and `docs/animations.md`.
- `insert-coin-screen`: Attract mode idle screen with 3-panel cycle (title, demo reel, how-to-play), INSERT COIN blink, hi-score count-up, and any-key entry. References `docs/screens/insert-coin.md`.
- `play-mode`: Breakout game on HTML5 Canvas — brick grid mapped to CV sections, ball physics, paddle control, SECTION_UNLOCKED fanfare overlay. References `docs/screens/play-mode.md`.
- `cv-list-mode`: Terminal-style CV viewer with sidebar nav, header identity block, scrollable content sections. References `docs/screens/cv-list.md`.

### Modified Capabilities

_(none — greenfield project)_

## Non-goals

- No backend, API routes, or database
- No authentication or user accounts
- No CMS or markdown-driven content (data lives in `src/data/resume.ts`)
- No mobile layout — this is a desktop arcade experience
- No test framework setup

## Impact

- New: `apps/web/` — entire Next.js application
- Design tokens: `--accent`, `--score`, `--bg`, `--text-primary`, `--text-muted`, `--text-dim`, full typography scale (`--text-hero` through `--text-micro`), spacing scale (`--space-1` through `--space-5`)
- Dependencies added: `typescript` (required), CSS build step optional — no framework deps mandated
- No infra changes
