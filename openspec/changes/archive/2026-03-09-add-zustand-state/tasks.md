## 1. Install Dependency

- [x] 1.1 Run `pnpm add zustand` and verify it appears in `package.json` dependencies

## 2. Game Store

- [x] 2.1 Create `src/stores/gameStore.ts` — wrap store with `persist` from `zustand/middleware` using `createJSONStorage(() => localStorage)`, key `"folio-game"`, and `partialize: (s) => ({ unlockedSections: s.unlockedSections, highScore: s.highScore })`; define `currentScreen` (`"insert-coin"` | `"play-mode"` | `"cv-list"`) and `setScreen` action
- [x] 2.2 In `gameStore.ts`, add `unlockedSections: string[]` and `unlockSection(id: string)` action (idempotent — no duplicates)
- [x] 2.3 In `gameStore.ts`, add `score: number`, `highScore: number`, and `addScore(points: number)` action — `addScore` updates both `score` and `highScore` via `Math.max(state.highScore, newScore)`
- [x] 2.4 In `gameStore.ts`, export `useGameStore` hook via `useStore` from `zustand` for React consumption

## 3. Barrel Export

- [x] 3.1 Create `src/stores/index.ts` re-exporting `gameStore` and `useGameStore`
