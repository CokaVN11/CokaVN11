## Context

Greenfield portfolio. All previous code was wiped. The design docs (`docs/design-system.md`, `docs/animations.md`, `docs/screens/*.md`) define the target — implementation must match them exactly. The user will build this themselves, so decisions here need to be explicit enough to guide implementation without ambiguity.

## Goals / Non-Goals

**Goals:**

- Single-page app — one URL, three screen states, no routing
- Design tokens as CSS custom properties — no hardcoded colors anywhere
- Canvas-based Breakout game with real physics, not a simulation
- Screen transitions feel like arcade hardware (instant cuts, scanline wipes)

**Non-Goals:**

- SSR-rendered content (all screens are client-side)
- Responsive/mobile layout
- Test suite
- Backend or API

## Decisions

### Decision 1: Screen state as a plain variable, not URL routing

**Chosen**: A `let currentScreen: Screen` variable (or framework equivalent) with three values: `INSERT_COIN | PLAY_MODE | CV_LIST`. A `setScreen(s: Screen)` function swaps the active DOM subtree (or calls the framework's render/signal equivalent).
**Why**: The portfolio is one continuous experience. URL changes would break the arcade illusion. The app lives at a single URL.
**Alternative**: Router pages per screen — rejected because it adds transitions complexity and breaks the single-session feel.

### Decision 2: CSS custom properties for all design tokens

**Chosen**: `globals.css` defines all `--token` variables on `[data-theme="dark"]` and `[data-theme="light"]`. Layout utilities (flex, grid, overflow) can use any CSS methodology — plain CSS, Tailwind, or utility classes.
**Why**: Tokens must be readable at runtime by the Canvas 2D API via `getComputedStyle(document.documentElement)`. Framework theming systems (Tailwind theme, CSS-in-JS) can't do this.
**Alternative**: Framework theme extension with CSS vars — adds unnecessary indirection; tokens must be in plain CSS custom properties regardless.

### Decision 3: Game physics in a plain mutable object, HUD in Zustand (stack: Astro + React + Zustand)

**Chosen**: A plain `let physics: GamePhysics | null = null` object holds ball/paddle/bricks — mutated directly each frame, never touches Zustand or React. HUD values (`score`, `highScore`, `lives`, `stage`, `speed`, `status`, `justUnlocked`) live in Zustand (`gameStore`). The game loop calls `useGameStore.getState().addScore(points)` (imperative, no hook) only on game events (brick hit, life lost, stage clear) — not per frame.
**Why**: The game loop runs at 60fps via `requestAnimationFrame`. Triggering reactive updates every frame tanks performance. Physics must be mutable without going through any reactive layer. HUD events are rare (event-driven, not frame-driven) so Zustand is fine.
**`status` ownership**: `status` lives only in Zustand. The game loop subscribes via `useGameStore.subscribe(s => s.status, status => { ... })` to start/stop `rAF`.
**Alternative (Phaser)**: Rejected. Phaser replaces the rAF loop, physics, and renderer but adds ~1MB for a simple 5×10 brick Breakout. CSS var color reading (Decision 4) becomes awkward (`setTint(hexInt)` vs direct `fillStyle`). Vanilla Canvas 2D is appropriate.
**Alternative (pure canvas HUD)**: Rejected — lives/score harder to style with the design system.

### Decision 4: Canvas colors read from CSS custom properties at draw time

**Chosen**: `getComputedStyle(document.documentElement).getPropertyValue('--brick-1')` called each frame.
**Why**: When `[T]` theme toggle fires, canvas immediately reflects the new theme on the next frame. No event listeners or prop drilling needed.
**Trade-off**: `getComputedStyle` call per brick per frame — negligible cost at 10 bricks × 5 rows.

### Decision 5: CRT theme toggle — CSS animation on `<html>`, theme swap at midpoint

**Chosen**: Apply `animation: themeSwitch 400ms` on `document.documentElement`. Swap `data-theme` attribute at 160ms (the black-out midpoint). Remove animation at 400ms.
**Why**: Gives the illusion of a CRT monitor powering off/on. The theme swap happens when nothing is visible, so there's no flash.
**Alternative**: `transition` on every token — produces a slow color blend, not an instant CRT cut.

### Decision 6: Attract mode cycle with `setInterval`, not `requestAnimationFrame`

**Chosen**: `setInterval(4000)` in the INSERT COIN screen to advance attract screen index (0 → 1 → 2 → 0).
**Why**: 4-second intervals don't need frame-level precision. `setInterval` is simpler and self-contained. Cleared on screen teardown.

### Decision 7: `Press Start 2P` loaded via Google Fonts in `globals.css` `@import`

**Chosen**: `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap')` at top of `globals.css`.
**Why**: Simplest approach for a portfolio. No self-hosting needed.
**Trade-off**: Requires network on first load. Acceptable for a portfolio.

## Risks / Trade-offs

- **Canvas sizing on resize** → Use `ResizeObserver` or `window.resize` listener in `PlayMode` to recalculate canvas dimensions while maintaining 4:3 ratio. Mitigation: cap at container size.
- **`getComputedStyle` in game loop** → If theme switches mid-game, one frame may mix old/new colors. Mitigation: imperceptible at 60fps, not worth caching.
- **INSERT COIN — any keypress enters play** → Global `keydown` listener must exclude `[T]`, `[G]`, `[B]`, `[E]`, `[C]` shortcuts. Mitigation: filter these keys before calling `onEnter`.
- **Score floats on canvas** → Implemented as a mutated array in the game physics object, aged each frame. If many bricks break simultaneously, floats stack. Mitigation: cap at 10 active floats.

## Open Questions

_(none — design is complete)_
