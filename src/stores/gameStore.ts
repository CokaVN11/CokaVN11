import { create } from "zustand";
import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import type { GameStatus } from "@/lib/game/types";

export type Screen = "insert-coin" | "play-mode" | "cv-list";

interface GameState {
  // Screen
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;

  // HUD — written imperatively via useGameStore.getState().* on game events only
  score: number;
  highScore: number;
  lives: number;
  stage: number;
  speed: number;
  status: GameStatus;
  justUnlocked: string | null;

  // Unlock tracking (persisted)
  unlockedSections: string[];

  // Actions
  addScore: (points: number) => void;
  unlockSection: (id: string) => void;
  setLives: (lives: number) => void;
  setStage: (stage: number) => void;
  setSpeed: (speed: number) => void;
  setStatus: (status: GameStatus) => void;
  setJustUnlocked: (section: string | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        currentScreen: "insert-coin",
        score: 0,
        highScore: 0,
        lives: 3,
        stage: 1,
        speed: 1,
        status: "idle",
        justUnlocked: null,
        unlockedSections: [],

        setScreen: (screen) => set({ currentScreen: screen }),

        addScore: (points) =>
          set((state) => {
            const newScore = state.score + points;
            return {
              score: newScore,
              highScore: Math.max(state.highScore, newScore),
            };
          }),

        unlockSection: (id) =>
          set((state) => ({
            unlockedSections: state.unlockedSections.includes(id)
              ? state.unlockedSections
              : [...state.unlockedSections, id],
          })),

        setLives: (lives) => set({ lives }),
        setStage: (stage) => set({ stage }),
        setSpeed: (speed) => set({ speed }),
        setStatus: (status) => set({ status }),
        setJustUnlocked: (justUnlocked) => set({ justUnlocked }),

        resetGame: () =>
          set({
            score: 0,
            lives: 3,
            stage: 1,
            speed: 1,
            status: "idle",
            justUnlocked: null,
          }),
      }),
      {
        name: "folio-game",
        storage: createJSONStorage(() => localStorage),
        partialize: (s) => ({
          unlockedSections: s.unlockedSections,
          highScore: s.highScore,
        }),
      },
    ),
  ),
);
