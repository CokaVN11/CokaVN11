## Context

The portfolio uses Astro with React islands (`client:load` / `client:visible`). React islands are isolated — each hydrates independently, meaning there's no automatic shared state between them. Game state (current screen, unlocked CV sections, score) needs to be readable and writable from multiple islands simultaneously.

Theme is already solved: `src/lib/theme.ts` provides plain DOM/localStorage utils (`getTheme`, `setTheme`, `toggleTheme`), and `src/lib/useTheme.ts` provides a React hook via `CustomEvent` subscription. No Zustand needed for theme.

Zustand's scope here is game state only.

## Goals / Non-Goals

**Goals:**

- Single source of truth for game state (screen, unlocked sections, score) across all React islands
- Store accessible from Astro scripts (plain JS) as well as React hooks
- Zero SSR concerns — client-only state

**Non-Goals:**

- Theme state management (handled by `src/lib/theme.ts`)
- Server-side state or SSR hydration of stores
- Persisting game state across page reloads (score resets — arcade design intent)

## Decisions

### 1. `zustand/vanilla` for the store core, `zustand` for React bindings

**Decision**: Create the game store using `createStore` from `zustand/vanilla`, then wrap with `useStore` from `zustand` for React consumption.

**Rationale**: `zustand/vanilla` stores are plain JS objects — no React dependency. Any Astro `<script>` tag can import and read/write the store directly. React islands bind via `useStore(store, selector)`. This is the canonical pattern for cross-framework state in Astro.

**Alternative considered**: React Context — rejected because Context doesn't cross island boundaries; each island gets its own React tree.

### 2. Game store is partially ephemeral

**Decision**: `unlockedSections` and `highScore` persist to localStorage via `persist` middleware; `score` and `currentScreen` reset on every page load.

**Rationale**: Unlocked sections represent player progress through the portfolio — losing them on reload breaks the experience. High score is a classic arcade retention mechanic. But the current session score and screen position should always start fresh — that's the "insert a coin" metaphor.

### 3. `persist` middleware with `partialize`

**Decision**: Use `persist` + `createJSONStorage(() => localStorage)` from `zustand/middleware`. Use `partialize` to whitelist only `{ unlockedSections, highScore }`.

**Rationale**: `partialize` is the cleanest way to persist a subset of state — no manual `localStorage.setItem` calls, no sync issues. The localStorage key is `"folio-game"`.

**Alternative considered**: Manual `localStorage` writes in actions — rejected because it duplicates logic and is error-prone.

### 4. Store files in `src/stores/`

**Decision**: `src/stores/gameStore.ts`, `src/stores/index.ts` (re-export barrel).

**Rationale**: Conventional location, separate from `src/lib/` which holds framework-agnostic utilities.

## Risks / Trade-offs

- **Multiple store subscribers on the same page**: Fine for Zustand — it handles fan-out efficiently. Not a risk.
- **Astro view transitions**: If view transitions are ever added, island re-mounts could reset React local state but Zustand store state persists across transitions (it's module-level, not component-level). This is a feature, not a risk.

## Migration Plan

1. `pnpm add zustand`
2. Create `src/stores/gameStore.ts` with vanilla store + React hook export
3. Create `src/stores/index.ts` barrel
