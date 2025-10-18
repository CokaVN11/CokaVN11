/**
 * GameBoy Portfolio UI - Game State Hook
 *
 * Zustand-based state management with LocalStorage persistence
 * Maintains type safety and follows best practices
 * Updated for Pokemon FireRed/LeafGreen theme system
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from '../types/gameboy';

// Simple storage configuration with basic error handling
const storage = {
  getItem: (name: string) => {
    try {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to parse storage item "${name}":`, error);
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store item "${name}":`, error);
      // Optionally track storage errors
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'storage_error', {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          item_name: name,
        });
      }
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Failed to remove item "${name}":`, error);
    }
  },
} as const;

// Create the store type with actions
type GameStateStore = GameState & {
  setAdventurerPosition: (position: { x: number; y: number }) => void;
  setAdventurerFacing: (facing: 'up' | 'down' | 'left' | 'right') => void;
  setAdventurerMoving: (isMoving: boolean) => void;
  updateNodeInteraction: (nodeId: string) => void;
  setNodeDiscovered: (nodeId: string, discovered?: boolean) => void;
  setCurrentView: (view: 'gameboy' | 'classic') => void;
  setActivePanel: (nodeId: string | null) => void;
  toggleHUD: (visible: boolean) => void;
  toggleControlsLock: (locked: boolean) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  updateProgress: (progress: Partial<GameState['progress']>) => void;
  unlockAchievement: (achievementId: string) => void;
  resetGame: () => void;
};

// Hydration function to safely merge stored state with defaults
const hydrateGameState = (persistedState: any, currentState: GameState): GameState => {
  try {
    if (!persistedState || typeof persistedState !== 'object') {
      console.warn('Invalid persisted state, using defaults');
      return currentState;
    }

    // Create a copy of the current state as the base
    const hydratedState: GameState = JSON.parse(JSON.stringify(currentState));

    // Safely merge adventurer position with bounds checking
    if (persistedState.adventurer?.position) {
      const pos = persistedState.adventurer.position;
      if (typeof pos.x === 'number' && typeof pos.y === 'number') {
        hydratedState.adventurer.position = {
          x: Math.max(0, Math.min(15, pos.x)), // Clamp to 0-15 grid
          y: Math.max(0, Math.min(15, pos.y)), // Clamp to 0-15 grid
        };
      }
    }

    // Safely merge adventurer facing direction
    if (persistedState.adventurer?.facing) {
      const validDirections = ['up', 'down', 'left', 'right'];
      if (validDirections.includes(persistedState.adventurer.facing)) {
        hydratedState.adventurer.facing = persistedState.adventurer.facing;
      }
    }

    // Safely merge adventurer moving flag
    if (typeof persistedState.adventurer?.isMoving === 'boolean') {
      hydratedState.adventurer.isMoving = persistedState.adventurer.isMoving;
    }

    // Safely merge nodes state
    if (persistedState.nodes && typeof persistedState.nodes === 'object') {
      Object.entries(persistedState.nodes).forEach(([nodeId, node]: [string, any]) => {
        if (node && typeof node === 'object' && hydratedState.nodes) {
          hydratedState.nodes[nodeId] = {
            discovered: typeof node.discovered === 'boolean' ? node.discovered : false,
            visited: typeof node.visited === 'boolean' ? node.visited : false,
            interactionCount:
              typeof node.interactionCount === 'number' ? Math.max(0, node.interactionCount) : 0,
            lastVisited:
              node.lastVisited && typeof node.lastVisited === 'number' ? node.lastVisited : null,
          };
        }
      });
    }

    // Safely merge progress data
    if (persistedState.progress && typeof persistedState.progress === 'object') {
      if (typeof persistedState.progress.totalInteractions === 'number') {
        hydratedState.progress.totalInteractions = Math.max(
          0,
          persistedState.progress.totalInteractions
        );
      }

      if (typeof persistedState.progress.uniqueNodesVisited === 'number') {
        hydratedState.progress.uniqueNodesVisited = Math.max(
          0,
          persistedState.progress.uniqueNodesVisited
        );
      }

      if (typeof persistedState.progress.totalPlayTime === 'number') {
        hydratedState.progress.totalPlayTime = Math.max(0, persistedState.progress.totalPlayTime);
      }

      // Safely merge achievements array
      if (Array.isArray(persistedState.progress.achievements)) {
        hydratedState.progress.achievements = persistedState.progress.achievements
          .filter((achievement: any) => achievement && typeof achievement.id === 'string')
          .map((achievement: any) => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
          }));
      }
    }

    // Safely merge UI state
    if (persistedState.ui && typeof persistedState.ui === 'object') {
      const validViews = ['gameboy', 'classic'];
      if (validViews.includes(persistedState.ui.currentView)) {
        hydratedState.ui.currentView = persistedState.ui.currentView;
      }

      if (persistedState.ui.activePanel !== undefined) {
        hydratedState.ui.activePanel = persistedState.ui.activePanel;
      }

      if (typeof persistedState.ui.hudVisible === 'boolean') {
        hydratedState.ui.hudVisible = persistedState.ui.hudVisible;
      }

      if (typeof persistedState.ui.controlsLocked === 'boolean') {
        hydratedState.ui.controlsLocked = persistedState.ui.controlsLocked;
      }
    }

    // Safely merge settings
    if (persistedState.settings && typeof persistedState.settings === 'object') {
      if (typeof persistedState.settings.soundEnabled === 'boolean') {
        hydratedState.settings.soundEnabled = persistedState.settings.soundEnabled;
      }

      if (typeof persistedState.settings.animationsEnabled === 'boolean') {
        hydratedState.settings.animationsEnabled = persistedState.settings.animationsEnabled;
      }

      if (typeof persistedState.settings.autoSave === 'boolean') {
        hydratedState.settings.autoSave = persistedState.settings.autoSave;
      }

      if (typeof persistedState.settings.selectedTheme === 'string') {
        hydratedState.settings.selectedTheme = persistedState.settings.selectedTheme;
      }
    }

    console.log('Game state hydrated successfully');
    return hydratedState;
  } catch (error) {
    console.error('Failed to hydrate game state:', error);
    return currentState; // Return default state on any error
  }
};

// Create Zustand store with persistence and hydration
export const useGameState = create<GameStateStore>()(
  persist(
    (set, get) => ({
      name: 'GameBoy Portfolio State',
      // Default game state
      adventurer: {
        position: { x: 8, y: 8 }, // Start in center of 16x16 grid
        facing: 'down',
        isMoving: false,
      },
      nodes: {}, // Will be populated from content
      progress: {
        totalInteractions: 0,
        uniqueNodesVisited: 0,
        sessionStartTime: Date.now(),
        totalPlayTime: 0,
        achievements: [],
      },
      ui: {
        currentView: 'gameboy',
        activePanel: null,
        hudVisible: true,
        controlsLocked: false,
      },
      settings: {
        soundEnabled: false,
        animationsEnabled: true,
        selectedTheme: 'fire', // Updated from 'classic' to 'fire' for Pokemon theme
        autoSave: true,
      },
      // State update actions
      setAdventurerPosition: (position: { x: number; y: number }) => {
        set((state) => ({
          adventurer: { ...state.adventurer, position },
        }));
      },

      setAdventurerFacing: (facing: 'up' | 'down' | 'left' | 'right') => {
        set((state) => ({
          adventurer: { ...state.adventurer, facing },
        }));
      },

      setAdventurerMoving: (isMoving: boolean) => {
        set((state) => ({
          adventurer: { ...state.adventurer, isMoving },
        }));
      },

      updateNodeInteraction: (nodeId: string) => {
        set((state) => {
          const currentNode = state.nodes[nodeId];
          if (currentNode) {
            return {
              nodes: {
                ...state.nodes,
                [nodeId]: {
                  ...currentNode,
                  discovered: true,
                  visited: true,
                  interactionCount: (currentNode.interactionCount || 0) + 1,
                  lastVisited: Date.now(),
                },
              },
            };
          }
          return state;
        });
      },

      setNodeDiscovered: (nodeId: string, discovered: boolean = true) => {
        set((state) => {
          const currentNode = state.nodes[nodeId];
          if (currentNode) {
            return {
              nodes: {
                ...state.nodes,
                [nodeId]: {
                  ...currentNode,
                  discovered,
                },
              },
            };
          }
          return state;
        });
      },

      setCurrentView: (view: 'gameboy' | 'classic') => {
        set((state) => ({
          ui: { ...state.ui, currentView: view },
        }));
      },

      setActivePanel: (nodeId: string | null) => {
        set((state) => ({
          ui: { ...state.ui, activePanel: nodeId },
        }));
      },

      toggleHUD: (visible: boolean) => {
        set((state) => ({
          ui: { ...state.ui, hudVisible: visible },
        }));
      },

      toggleControlsLock: (locked: boolean) => {
        set((state) => ({
          ui: { ...state.ui, controlsLocked: locked },
        }));
      },

      updateSettings: (settings: Partial<GameState['settings']>) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      updateProgress: (progress: Partial<GameState['progress']>) => {
        set((state) => ({
          progress: { ...state.progress, ...progress },
        }));
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const existingAchievement = state.progress.achievements.find(
            (a) => a.id === achievementId
          );
          if (!existingAchievement) {
            const newAchievement = {
              id: achievementId,
              name: `Achievement ${achievementId}`,
              description: 'Unlocked a new achievement',
              icon: '🏆',
              unlockedAt: new Date(),
              progress: 1,
              maxProgress: 1,
              rarity: 'common' as const,
              category: 'special' as const,
            };

            return {
              progress: {
                ...state.progress,
                achievements: [...state.progress.achievements, newAchievement],
              },
            };
          }
          return state;
        });
      },

      // Reset game to initial state
      resetGame: () => {
        set((state) => ({
          ...state,
          adventurer: {
            position: { x: 8, y: 8 },
            facing: 'down',
            isMoving: false,
          },
          nodes: {},
          progress: {
            totalInteractions: 0,
            uniqueNodesVisited: 0,
            sessionStartTime: Date.now(),
            totalPlayTime: 0,
            achievements: [],
          },
          ui: {
            currentView: 'gameboy',
            activePanel: null,
            hudVisible: true,
            controlsLocked: false,
          },
          settings: {
            soundEnabled: false,
            animationsEnabled: true,
            selectedTheme: 'fire', // Updated from 'classic' to 'fire' for Pokemon theme
            autoSave: true,
          },
        }));
      },
    }),
    {
      name: 'gameboy-portfolio:state',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Custom onRehydrateStorage for state recovery and validation
      onRehydrateStorage: () => (state) => {
        try {
          if (!state) return;

          // Apply safe validation and cleanup to rehydrated state
          const hydratedState = hydrateGameState(state, state);

          // Update the state with validated data
          Object.keys(hydratedState).forEach((key) => {
            if (state[key as keyof GameState] !== hydratedState[key as keyof GameState]) {
              (state as any)[key] = hydratedState[key as keyof GameState];
            }
          });

          console.log('State rehydrated and validated successfully');
        } catch (error) {
          console.error('Rehydration callback failed:', error);
        }
      },
    }
  )
);

// Export store instance for direct access
export const gameStateStore = useGameState.getState;
export const gameStateActions = useGameState.getState;

// Custom hook to provide the expected interface for components
export const useGameStateActions = () => {
  const state = useGameState();

  const moveCharacter = (x: number, y: number) => {
    useGameState.getState().setAdventurerPosition({ x, y });
  };

  const interactWithNode = (nodeId: string) => {
    useGameState.getState().updateNodeInteraction(nodeId);
  };

  return {
    gameState: state,
    moveCharacter,
    interactWithNode,
  };
};