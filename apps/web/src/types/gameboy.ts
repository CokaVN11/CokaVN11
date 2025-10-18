/**
 * GameBoy Portfolio UI - Type Definitions
 *
 * Core interfaces and types for GameBoy-style portfolio implementation
 * Maintains compatibility with existing folio-site architecture
 * Updated for Pokemon FireRed/LeafGreen theme system
 */

// Position and Movement Types
export type Position = {
  x: number; // 0-15 (16 tile grid)
  y: number; // 0-15 (16 tile grid)
};

export type Direction = 'up' | 'down' | 'left' | 'right';

// Node and Map Types
export type NodeType = 'project' | 'experience';

export interface MapNode {
  id: string;
  type: NodeType;
  position: Position;
  title: string;
  description: string;
  mdxSlug: string; // References content in apps/web/src/content/
}

// Game State Interfaces
export interface GameState {
  // Character position and movement
  adventurer: {
    position: Position;
    facing: Direction;
    isMoving: boolean;
  };

  // Map nodes (projects and experiences)
  nodes: {
    [nodeId: string]: {
      discovered: boolean;
      visited: boolean;
      interactionCount: number;
      lastVisited: number | null; // Unix timestamp
    };
  };

  // User progress and achievements
  progress: {
    totalInteractions: number;
    uniqueNodesVisited: number;
    sessionStartTime: number;
    totalPlayTime: number; // milliseconds
    achievements: Achievement[];
  };

  // Interface state
  ui: {
    currentView: 'gameboy' | 'classic';
    activePanel: string | null; // node ID or null
    hudVisible: boolean;
    controlsLocked: boolean;
  };

  // Settings and preferences (updated for Pokemon themes)
  settings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    selectedTheme: 'fire' | 'leaf'; // Updated from GBC palette to Pokemon theme
    autoSave: boolean;
  };
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  category: 'exploration' | 'interaction' | 'completion' | 'special';
  criteria?: {
    type: string;
    target: number;
    conditions?: Record<string, any>;
  };
  rewards?: {
    theme?: 'fire' | 'leaf'; // Updated from GBC palette to Pokemon theme
    badge?: string;
    unlocks?: string[];
  };
}

// Component Props Interfaces (updated for Pokemon themes)
export interface GameBoyContainerProps {
  gameState: GameState;
  onStateUpdate: (state: Partial<GameState>) => void;
}

// Map Configuration Types
export interface MapConfig {
  // Grid dimensions (fixed for GameBoy aesthetic)
  width: 16;
  height: 16;

  // Tile types and their properties
  tiles: {
    [position: string]: {
      // "x,y" format
      type: 'grass' | 'path' | 'water' | 'tree' | 'mountain' | 'node';
      walkable: boolean;
      nodeId?: string; // References project/experience
      sprite?: string; // Tile sprite identifier
    };
  };

  // Node placement and configuration
  nodes: {
    [nodeId: string]: MapNode;
  };

  // Starting position for adventurer
  startPosition: {
    x: number;
    y: number;
  };
}

// Content Frontmatter Types
export interface ContentFrontmatter {
  // Existing fields from folio-site
  title: string;
  description: string;
  date: string;
  tags: string[];

  // GameBoy integration fields
  mapNode: {
    title: string; // Short title for map display
    description: string; // Short description for hover tooltip
    icon: string; // Icon or sprite identifier
    color: 'primary' | 'secondary' | 'tertiary';
  };

  // Metadata for game integration
  gameData: {
    nodeType: 'project' | 'experience';
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // minutes to explore
    achievements: string[];
  };
}

// Event Types
export interface GameEvent {
  type: 'move' | 'interact' | 'view_change' | 'achievement_unlock' | 'save' | 'load';
  timestamp: number;
  data: {
    // Event-specific data
    [key: string]: any;
  };
}

// LocalStorage Keys (Type-safe)
export const STORAGE_KEYS = {
  GAME_STATE: 'gameboy-portfolio:state' as const,
  SETTINGS: 'gameboy-portfolio:settings' as const,
  ACHIEVEMENTS: 'gameboy-portfolio:achievements' as const,
  CACHE: 'gameboy-portfolio:cache' as const,
  ANALYTICS: 'gameboy-portfolio:analytics' as const,
} as const;

// Animation Constants
export const ANIMATION_DURATION = {
  WALK: 100, // ms for character movement
  PANEL_OPEN: 150, // ms for panel opening
  PANEL_CLOSE: 100, // ms for panel closing
  NODE_INTERACTION: 200, // ms for node interaction
  ACHIEVEMENT_UNLOCK: 300, // ms for achievement unlock
} as const;

// Grid Constants
export const GRID_CONFIG = {
  WIDTH: 16,
  HEIGHT: 16,
  TILE_SIZE: 40, // CSS pixel size (default: 40px)
  MAX_NODES: 5, // Maximum number of interactive nodes
} as const;

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Utility Types
export type TilePosition = `${number},${number}`; // "x,y" format
export type NodeId = string;