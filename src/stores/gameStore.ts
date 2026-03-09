import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Screen = "insert-coin" | "play-mode" | "cv-list";

interface GameState {
  currentScreen: Screen;
  unlockedSections: string[];
  score: number;
  highScore: number;
  setScreen: (screen: Screen) => void;
  unlockSection: (id: string) => void;
  addScore: (points: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentScreen: "insert-coin",
      unlockedSections: [],
      score: 0,
      highScore: 0,

      setScreen: (screen) => set({ currentScreen: screen }),

      unlockSection: (id) =>
        set((state) => ({
          unlockedSections: state.unlockedSections.includes(id)
            ? state.unlockedSections
            : [...state.unlockedSections, id],
        })),

      addScore: (points) =>
        set((state) => {
          const newScore = state.score + points;
          return {
            score: newScore,
            highScore: Math.max(state.highScore, newScore),
          };
        }),
    }),
    {
      name: "folio-game",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        unlockedSections: s.unlockedSections,
        highScore: s.highScore,
      }),
    }
  )
);
