> **READ FIRST**: Before writing any code, read `openspec/changes/portfolio-os-foundation/design.md`.
> It explains the architectural decisions behind this implementation — the Screen state machine, CSS custom property strategy, ref-vs-state split in the game loop, and the CRT toggle mechanism.
> Each decision in `design.md` is numbered (Decision 1–5). Tasks below that are directly shaped by these decisions include a `→ see design.md §Decision N` callout.

## 1. Project Setup

> **Choose your stack** — the rest of the tasks are stack-agnostic. Options:
> - **Vanilla TS + Vite**: `npm create vite@latest -- --template vanilla-ts`
> - **Next.js**: `npx create-next-app@latest` (App Router, TypeScript, no Tailwind required)
> - **SvelteKit / Astro / other**: any framework that lets you write TypeScript and a single `index.html` entry
>
> The only hard requirements: TypeScript, a CSS file you control (`globals.css`), and a single HTML page at `/`.

- [x] 1.1 Scaffold the project using your chosen stack. Confirm you can run a dev server and see a blank page.
- [x] 1.2 Create `tsconfig.json` (or verify the generated one) with `strict: true`, `target: ES2017`, and path alias `@/*` → `src/*`.
- [x] 1.3 Create `src/styles/globals.css` (empty for now — populated in Task 2). Import it in your entry point.
- [x] 1.4 Create `src/main.ts` (or your framework's entry file) — this will become the screen router in Task 12.
- [x] 1.5 Verify: dev server runs, TypeScript compiles with zero errors (`tsc --noEmit`).

## 2. Design System
<!-- → see design.md §Decision 2: CSS custom properties are the design token layer. Framework theming (Tailwind theme, CSS-in-JS) cannot be read by Canvas at runtime — CSS vars can. -->

- [x] 2.1 Open `src/styles/globals.css` — add `@import` for Press Start 2P from Google Fonts at the top. If using Tailwind, add `@tailwind base/components/utilities` after. File: `src/styles/globals.css`
- [x] 2.2 Add `:root` block with `--font-arcade`, `--text-hero` (28px) through `--text-micro` (7px), and `--space-1` (8px) through `--space-5` (40px). Reference: `docs/design-system.md` §Typography and §Spacing
- [x] 2.3 Add `:root[data-theme="dark"]` with all color tokens: `--bg`, `--bg-sidebar`, `--bg-canvas`, `--text-primary`, `--text-muted`, `--text-dim`, `--accent`, `--score`, `--brick-1` through `--brick-5`, `--ball`, `--paddle`, `--border`, `--border-muted`, `--unlock-border`, `--scanline`, `--vignette`. Reference: `docs/design-system.md` §Color Tokens
- [x] 2.4 Add `:root[data-theme="light"]` with all light-mode equivalents. Reference: `docs/design-system.md` §Color Tokens
- [x] 2.5 Add all animation `@keyframes`: `insertCoinBlink` (600ms step-end), `dotScan`, `textFlicker`, `cursorBlink`, `digitRoll`, `crtFlicker`, `themeSwitch` (400ms), `paddleCompress`, `phosphorPulse`, `starPulse`, `scaleIn`. Reference: `docs/animations.md`
- [x] 2.6 Add `.crt-canvas::after` (scanline repeating-linear-gradient using `--scanline`) and `.crt-canvas::before` (radial vignette using `--vignette`). Reference: `docs/design-system.md` §CRT Scanline System
- [x] 2.7 Add `[data-theme="dark"] .crt-flicker { animation: crtFlicker 4s infinite }` — dark mode only. Reference: `docs/animations.md` §crtFlicker
- [x] 2.8 Add utility classes: `.insert-coin-blink`, `.text-flicker`, `.cursor-blink`, `.theme-switching`, `.scale-in`, `.score-glow`, `.score-glow-pulse`, `.no-scrollbar`, `.chrome-bar`, `.dot-divider`, `.corner-accent`. Token used: `--score`, `--accent`, `--text-dim`

## 3. Types and Data
<!-- → see design.md §Decision 1: Screen is a union type string enum, not a numeric enum. The app is a single page — screens swap via client-side state, not routing. -->

- [x] 3.1a Create `src/game/types.ts` — export `type GameStatus = 'idle' | 'launching' | 'playing' | 'paused' | 'lost_life' | 'stage_clear' | 'section_unlocked' | 'gameover'` and physics interfaces: `Ball { x, y, dx, dy }`, `Paddle { x, width }`, `Brick { alive, cssVar, points, section, rowIndex, colIndex }`, `ScoreFloat { x, y, text, age }`, `GamePhysics { ball, paddle, bricks: Brick[][], scoreFloats: ScoreFloat[] }`. File: `src/game/types.ts`
- [x] 3.1b Create `src/resume/types.ts` — export resume interfaces: `ExperienceEntry { id, period, title, company, bullets[] }`, `StackData { languages, frontend, backend, data, infra: string[][] }`, `ProjectEntry { id, name, type, description, tech[] }`, `EducationEntry { degree, school, period, gpa? }`, `ResumeData { name, title, location, contact, overview, experience, stack, projects, education }`. Also export `NAV_SECTIONS` as a const tuple and `NavSection` type. File: `src/resume/types.ts`
- [x] 3.1c Update `src/lib/types.ts` — remove all type definitions. Re-export `Screen` from `src/stores/gameStore.ts` and `Theme` from `src/lib/theme.ts`. Nothing else — this file is a thin barrel for cross-cutting shared types only. File: `src/lib/types.ts`
- [x] 3.2 Create `src/resume/content.ts` — export `RESUME: ResumeData` object with your real name, title, location, contact links, overview text, experience entries, stack, projects, and education. Import types from `src/resume/types.ts`. File: `src/resume/content.ts`

## 4. Theme Module
<!-- → see design.md §Decision 5: The theme switch is a 400ms CRT power-cycle. data-theme swaps at the 160ms blackout midpoint — not immediately. The switching flag gates any UI changes during the animation. -->

- [x] 4.1 Create `src/modules/theme.ts` — export `initTheme()` (reads `localStorage.getItem('theme')`, sets `data-theme` on `document.documentElement`) and a `switching` boolean flag. File: `src/modules/theme.ts`
- [x] 4.2 Export `toggleTheme()`: set `switching = true`, apply `animation: themeSwitch 400ms` on `document.documentElement`, swap `data-theme` at 160ms (the black-out midpoint), clear animation and `switching` at 400ms. Reference: `docs/animations.md` §Theme Toggle

## 5. Chrome Modules

- [x] 5.1 Create `src/chrome/top-bar.ts` — renders/updates the top bar DOM element given `screen: Screen`. Left: `[P] PORTFOLIO OS` (`--accent` for `[P]`). Center: nav links — default shows `[B] BLOG`, `[E] EVENTS`, `[G] GITHUB`, `[C] CONSOLE`; CV mode shows `[G] GITHUB`, `[L] LINKEDIN`, `[D] DOWNLOAD CV`. Right: `[T]` button. All text `--text-micro`. File: `src/chrome/top-bar.ts`. Reference: `docs/design-system.md` §Top Bar
- [x] 5.2 Create `src/chrome/footer.ts` — renders/updates the footer DOM element given `screen`, `hiScore`, `onToggleMode`. Left: `© 2025 COKA · 1 CREDIT · HI-SC {score}` at `--text-micro`. Right: `[LIST MODE]` or `[PLAY MODE]` button in `--accent`. Token: `--text-primary`, `--accent`. File: `src/chrome/footer.ts`. Reference: `docs/design-system.md` §Footer Bar

## 6. Shared UI Modules

- [x] 6.1 Create `src/ui/dot-divider.ts` — renders a row of `·` characters into a given container element. Each `<span>` gets `animation: dotScan 1.2s ease-in-out infinite` with incrementing `animation-delay` (0.045s per dot). Token: `--text-dim`. File: `src/ui/dot-divider.ts`. Reference: `docs/animations.md` §Dot scanner
- [x] 6.2 Create `src/screens/section-unlocked-overlay.ts` — accepts `section`, `onDismiss`, `onViewSection`. Renders centered overlay box with `--unlock-border` border and glow. On mount: type out "★ SECTION UNLOCKED ★" at 40ms/char, show section name at 800ms, show blinking "PRESS [ENTER] TO VIEW" at 1200ms. Auto-dismiss via `setTimeout(onDismiss, 4000)`. Listen for `Enter` → `onViewSection`, `Escape` → `onDismiss`. Token: `--unlock-border`, `--score`, `--accent`. File: `src/screens/section-unlocked-overlay.ts`. Reference: `docs/animations.md` §SECTION_UNLOCKED fanfare

## 7. CV List Screen

- [x] 7.1 Create `src/screens/cv-list.ts` — exports `mountCVList(container, initialSection, onBack)`. Track `activeSection` (NavSection), `cursorIdle` (boolean), `avatarVisible` (boolean) as plain module variables. File: `src/screens/cv-list.ts`. Reference: `docs/screens/cv-list.md`
- [x] 7.2 Implement idle cursor timer: reset a 2s timeout on every section change. When timer fires, set `cursorIdle = true`. On any navigation, clear timer and set `cursorIdle = false`.
- [x] 7.3 Add `keydown` handler: `ArrowUp`/`ArrowLeft` → prev section, `ArrowDown`/`ArrowRight` → next section, `Escape` → `onBack()`. Call `resetIdleTimer()` on navigation.
- [x] 7.4 Render fixed sidebar: "IDENTIFIER" label in `--text-muted` at `--text-label`. Five nav buttons — active has `►` in `--accent` (add class `cursor-blink` when `cursorIdle`), inactive has invisible `►` placeholder. "← RETURN" button at bottom calls `onBack`. Token: `--bg-sidebar`, `--text-muted`, `--accent`
- [x] 7.5 Render header block in content pane: avatar box (80×80, `--border`, corner accents, `◈` icon with `text-flicker` on mount, "PLAYER 1" label). Identity: version/status line with green `●` dot, name at `--text-name` in `--accent`, title at `--text-body`, contact rows at `--text-ui` in `--text-muted`. Token: `--border`, `--score`, `--accent`
- [x] 7.6 Render OVERVIEW section: `/ OVERVIEW` header at `--text-heading` in `--accent`, body text at `--text-ui`, `DotDivider` after. Add `id="section-OVERVIEW"` for scroll targeting.
- [x] 7.7 Render EXPERIENCE section: for each entry — `FIG.XX` label in `--text-muted`, date badge with `--border`, job title at `--text-heading`, `► COMPANY` in `--accent`, numbered bullets (`01` `02` in `--text-muted`, text in `--text-primary`). `DotDivider` after.
- [x] 7.8 Render STACK section: grouped by category (languages, frontend, backend, data, infra), items joined by two spaces (no chips), tech in `--text-primary`. `DotDivider` after.
- [x] 7.9 Render PROJECTS section: for each entry — `PROJ_XX // TYPE` in `--text-muted`, name at `--text-heading`, horizontal rule in `--text-dim`, description at `--text-ui`, tech tags in `--accent`. `DotDivider` after.
- [x] 7.10 Render EDUCATION section: degree at `--text-heading`, `► SCHOOL` in `--accent`, period and GPA in `--text-muted`. No divider (last section).
- [x] 7.11 Add `scrollIntoView` effect: when `activeSection` changes, call `document.getElementById('section-' + activeSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' })`.

## 8. INSERT COIN Screen

- [x] 8.1 Create `src/screens/insert-coin.ts` — exports `mountInsertCoin(container, onEnter)`. Manage `attractIndex` (0/1/2) with `setInterval(4000)`. Track `hiScore` as a local variable starting at 0. File: `src/screens/insert-coin.ts`. Reference: `docs/screens/insert-coin.md`
- [x] 8.2 Implement hi-score count-up: on mount, use `requestAnimationFrame` to animate from 0 to 9001 over 800ms with ease-out curve. After 200ms delay, add class `text-flicker` to PLAYER name elements. Token: `--score` via class `score-glow-pulse`
- [x] 8.3 Implement attract screen 0 (Title): PLAYER 1/PLAYER 2 labels + names, star row + "PORTFOLIO OS" at `--text-hero` in `--accent`, `DotDivider`, "► INSERT COIN ◄" with class `insert-coin-blink` at `--text-name`, `DotDivider`. Token: `--accent`, `--text-primary`
- [x] 8.4 Implement attract screen 1 (Demo Reel): "- - DEMO - -" label, preview box with corner accents and three colored brick rows, caption. Token: `--brick-1`, `--brick-2`, `--brick-3`, `--border-muted`
- [x] 8.5 Implement attract screen 2 (How to Play): "H O W  T O  P L A Y" heading, list of key/action pairs. Token: `--accent`, `--text-muted`
- [x] 8.6 Add global `keydown` listener: skip `t`, `b`, `e`, `g`, `c` keys, call `onEnter()` for all others. Add `click` listener on the container to also call `onEnter()`. Clean up listeners on screen teardown (call `unmountInsertCoin()`).

## 9. Game Module — Physics and Init
<!-- → see design.md §Decision 3: Physics (ball, paddle, bricks, velocity) are plain mutable objects in engine.ts — never touch Zustand. HUD (score, lives, stage, status) lives in Zustand gameStore, written imperatively via useGameStore.getState().* on game events only (not per frame). Canvas rendering: vanilla Canvas 2D (not Phaser/PixiJS — see design.md §Decision 3). -->

- [x] 9.1 Create `src/game/engine.ts` — define constants: `COLS = 10`, `BRICK_HEIGHT = 20`, `BRICK_GAP_X = 8`, `BRICK_GAP_Y = 6`, `BRICK_TOP_PAD = 24`, `CANVAS_PAD_X = 16`, `BALL_SIZE = 6`, `PADDLE_WIDTH = 80`, `PADDLE_HEIGHT = 8`, `PADDLE_BOTTOM = 30`, `BASE_SPEED = 4`. Import types from `src/game/types.ts`. File: `src/game/engine.ts`
- [x] 9.2 Define `BRICK_ROW_DEFS` array (5 entries) mapping `cssVar` (`--brick-1` through `--brick-5`), `points` (100/200/300/500/800), and `section` name to each row.
- [x] 9.3 Implement `buildBricks(stage)` — creates a 2D `Brick[][]` array. Number of rows = `Math.min(3 + Math.max(0, stage - 1), 5)`. Each brick: `{ alive: true, cssVar, points, section, rowIndex, colIndex }`.
- [x] 9.4 Implement `brickRect(col, row, canvasW)` — calculates `{x, y, w, h}` for a brick given canvas width, using `CANVAS_PAD_X`, `BRICK_GAP_X`, `BRICK_GAP_Y`, `BRICK_TOP_PAD`. Brick width = `(canvasW - CANVAS_PAD_X * 2 - (COLS - 1) * BRICK_GAP_X) / COLS`.
- [x] 9.5 Implement `initPhysics(stage, canvasW, canvasH)` — returns `GamePhysics` with ball centered above paddle, velocity at `-45°` ± small random offset, speed from `BASE_SPEED + (stage - 1) * 0.6`, paddle centered.
- [x] 9.6 Expand `gameStore` with missing HUD fields: `lives` (3), `stage` (1), `speed` (1), `status: GameStatus` (`'idle'`), `justUnlocked: string | null` (null). Add corresponding setters. These are the only fields the game loop writes to Zustand — via `useGameStore.getState().*` imperatively (no hook).
- [x] 9.7 Initialize module state: `let physics: GamePhysics | null = null`, `let animFrameId: number`, `let paddleTarget = 0`. No local `hud` object — HUD state lives in Zustand (see Decision 3). Export `initGame(canvas: HTMLCanvasElement)` — sets up the canvas ref and subscribes to `status` via `useGameStore.subscribe(s => s.status, ...)` to start/stop the rAF loop.

## 10. Game Module — Loop, Collisions, and Unlocks

- [x] 10.1 Implement `draw(ctx, canvas)` — clear canvas, draw alive bricks (read color via `getComputedStyle(document.documentElement).getPropertyValue(brick.cssVar)`) <!-- → see design.md §Decision 4: CSS vars are read from getComputedStyle on every frame so theme switches apply instantly without restarting the game loop. -->, draw paddle (`--paddle`), draw ball (`--ball`) as 6×6 filled rectangle. Draw score floats (small text, fade by age).
- [x] 10.2 Implement `update(dt)` — move ball by `dx * dt` / `dy * dt`. Check left/right/top wall reflection (flip dx or dy, push ball back to boundary). Check paddle AABB collision: if ball bottom >= paddleY and ball x within paddle bounds, reflect dy, compute new dx based on hit position ratio.
- [x] 10.3 Implement brick collision in `update`: for each alive brick, run AABB test against ball. On hit: mark brick dead, determine reflect axis (which overlap is smallest — horizontal or vertical), flip dx or dy. Push score float into `physics.scoreFloats`. Call `useGameStore.getState().addScore(brick.points)`. Check if full row is now dead → if yes, call `useGameStore.getState().unlockSection(section)`, `setStatus('section_unlocked')`, `setJustUnlocked(section)`.
- [x] 10.4 Implement bottom boundary check: if ball y > canvasH, read `lives = useGameStore.getState().lives`. Call `useGameStore.getState().setLives(lives - 1)`. Call `setStatus(lives - 1 > 0 ? 'lost_life' : 'gameover')`.
- [x] 10.5 Implement `startLoop()` using `requestAnimationFrame`. Each frame: compute `dt = Math.min(elapsed, 32) / 16`, call `update(dt)`, call `draw()`. Store frame id in `animFrameId`.
- [x] 10.6 `status` is watched via the Zustand subscription set up in `initGame()` (task 9.7) — no additional wiring needed here. When status becomes `'lost_life'`: reset ball position above paddle, then call `setStatus('playing')` after 1200ms delay.
- [x] 10.7 Export public API: `{ launch, dismissUnlock, resetGame, setPaddleTarget, movePaddleLeft, movePaddleRight, destroyGame }`. HUD is read directly from `useGameStore` by React components — no `getHud` needed.

## 11. Play Mode Screen

- [x] 11.1 Create `src/screens/play-mode.ts` — exports `mountPlayMode(container, onViewSection)`. Get references to the `<canvas>` and its container element. Call `initGame(canvas)`. File: `src/screens/play-mode.ts`. Reference: `docs/screens/play-mode.md`
- [x] 11.2 Canvas sizing: on mount and `resize`, read container dimensions, compute canvas size maintaining 4:3 ratio, set `canvas.width`/`canvas.height` and inline `style.width`/`style.height`. Use `ResizeObserver` or `window.addEventListener('resize', ...)`.
- [x] 11.3 Add `mousemove` listener on canvas: compute mouse X relative to canvas left edge, call `setPaddleTarget(mouseX)`.
- [x] 11.4 Add global `keydown` listener: `ArrowLeft`/`a` → `movePaddleLeft()`, `ArrowRight`/`d` → `movePaddleRight()`, `Space` → `launch()` (if idle), `Enter` → `onViewSection` + `dismissUnlock` (if section_unlocked), `Escape` → `resetGame()`.
- [x] 11.5 Render HUD strip (two lines, three clusters) above canvas. Left: HI-SC + SCORE (score in class `score-glow`). Center: P·1 + STAGE XX/06. Right: LIVES ♥♥♡ + SPEED ●●○○○. Token: `--text-muted` (labels), `--text-primary` (values), `--score` (score), `--accent` (speed pips). Reference: `docs/screens/play-mode.md` §HUD Row
- [x] 11.6 Render canvas container with dot divider above and below, corner accent characters (`┌ ┐ └ ┘`), orange border (`--border`) and glow. Read `status` from `useGameStore`. Add "PRESS [SPACE] TO LAUNCH" blink overlay when `status === 'idle'`. Add GAME OVER overlay when `status === 'gameover'`.
- [x] 11.7 Mount `section-unlocked-overlay` when `useGameStore status === 'section_unlocked'`; unmount it otherwise. On dismiss: call `useGameStore.getState().setJustUnlocked(null)` and `setStatus('playing')`.
- [x] 11.8 Render section nav row below canvas: all five section names, `►` cursor before active, locked in `--text-muted`, unlocked in `--text-primary`. Reference: `docs/screens/play-mode.md` §Section Nav

## 12. App Assembly

- [x] 12.1 In `index.html` (or your framework's root template): set `<html lang="en" data-theme="dark">`, add Google Fonts preconnect `<link>` tags in `<head>`, set `<title>PORTFOLIO OS — COKA</title>`. Import `src/styles/globals.css`.
- [x] 12.2 In `src/main.ts`: call `initTheme()`. Declare `let currentScreen: Screen = 'INSERT_COIN'` and `let cvSection = 'OVERVIEW'`. Build the persistent layout shell — top bar, `<main>` (flex 1, overflow hidden), footer — and mount it once.
- [x] 12.3 Implement `setScreen(s: Screen)`: unmount the current screen from `<main>`, mount the new one. Call `updateTopBar(s)` and `updateFooter(s)`.
- [x] 12.4 Implement screen callbacks: `handleEnterCoin` → `setScreen('PLAY_MODE')`, `handleViewSection(section)` → `cvSection = section; setScreen('CV_LIST')`, `handleBackToPlay` → `setScreen('PLAY_MODE')`, `handleModeToggle` → toggle between PLAY_MODE and CV_LIST.
- [x] 12.5 Add global `keydown` listener: `[T]` → `toggleTheme()`, `[G]` → `window.open(github)`, `[P]` → `setScreen('INSERT_COIN')`.
- [x] 12.6 Verify: run `tsc --noEmit` (or your framework's build) — must pass with zero TypeScript errors. Open the app in browser and confirm all three screens, theme toggle, game loop, and section unlock flow work end-to-end.
