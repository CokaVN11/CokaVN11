## Why

Game-level state (current screen, unlocked CV sections, score) needs to be shared across React islands in real time. Without a shared store, each island manages its own state in isolation — screen transitions and brick-unlock events can't propagate across the INSERT COIN → PLAY MODE → CV LIST flow.

## What Changes

- Add `zustand` as a dependency
- Introduce `src/stores/` with a single vanilla Zustand store for game state
- Create `gameStore` for game-level state: current screen, unlocked CV sections, score

## Capabilities

### New Capabilities

- `game-store`: Shared game state (current screen, unlocked sections, score) for the INSERT COIN → PLAY MODE → CV LIST flow

### Modified Capabilities

<!-- No existing spec-level requirements are changing — this is purely additive infrastructure -->

## Impact

- **Dependencies**: adds `zustand` (pnpm)
- **New files**: `src/stores/gameStore.ts`, `src/stores/index.ts`
- **No design token or UI changes** — this is state wiring only
- **Non-goals**: No SSR/server-side state; store is client-only. Score resets on reload by design — it's an arcade.
