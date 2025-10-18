/**
 * GameBoy Portfolio UI - Map Configuration
 *
 * Defines the 16×16 tile map layout with 5 interactive nodes
 * Positions projects and experiences for discovery and interaction
 * Updated for Pokemon FireRed/LeafGreen theme system
 */

import type { Position, MapNode, NodeType } from '../../types/gameboy';

// Map configuration based on specification
export const MAP_CONFIG = {
  // Grid dimensions (fixed for GameBoy aesthetic)
  width: 16, // 16 tiles
  height: 16, // 16 tiles
  tileSize: 40, // 40px per tile (640x640px total)

  // Starting position (center of map)
  startPosition: {
    x: 8, // Center column
    y: 8, // Center row
  },

  // Interactive nodes (3 projects, 2 experiences)
  // Positioned to create exploration paths
  nodes: {
    'tech-blog-platform': {
      id: 'tech-blog-platform',
      type: 'project' as NodeType,
      position: { x: 2, y: 3 },
      title: 'Tech Blog Platform',
      description: 'Node.js-powered blogging platform with real-time analytics',
      mdxSlug: 'tech-blog-platform',
      mapNode: {
        title: 'Blog Platform',
        description: 'Modern blogging experience',
        icon: '💻',
        color: 'primary' as const,
      },
    },

    'ai-chat-assistant': {
      id: 'ai-chat-assistant',
      type: 'project' as NodeType,
      position: { x: 12, y: 2 },
      title: 'AI Chat Assistant',
      description: 'Interactive AI chatbot with natural language processing',
      mdxSlug: 'ai-chat-assistant',
      mapNode: {
        title: 'AI Assistant',
        description: 'Advanced AI technology',
        icon: '🤖',
        color: 'secondary' as const,
      },
    },

    'weather-dashboard': {
      id: 'weather-dashboard',
      type: 'project' as NodeType,
      position: { x: 6, y: 8 },
      title: 'Weather Dashboard',
      description: 'Real-time weather monitoring with predictive analytics',
      mdxSlug: 'weather-dashboard',
      mapNode: {
        title: 'Weather App',
        description: 'Weather monitoring system',
        icon: '🌤',
        color: 'tertiary' as const,
      },
    },

    'freelance-platform': {
      id: 'freelance-platform',
      type: 'project' as NodeType,
      position: { x: 14, y: 12 },
      title: 'Freelance Platform',
      description: 'Full-stack freelance marketplace with payment processing',
      mdxSlug: 'freelance-platform',
      mapNode: {
        title: 'Freelance Hub',
        description: 'Freelance management system',
        icon: '💰',
        color: 'primary' as const,
      },
    },

    'design-system-docs': {
      id: 'design-system-docs',
      type: 'experience' as NodeType,
      position: { x: 8, y: 14 },
      title: 'Design System Documentation',
      description: 'Comprehensive design system with component library',
      mdxSlug: 'design-system-docs',
      mapNode: {
        title: 'Design Docs',
        description: 'Design system documentation',
        icon: '📚',
        color: 'tertiary' as const,
      },
    },
  } as const,
};

// Helper functions for map operations
export const getTileAtPosition = (
  x: number,
  y: number
): { type: string; walkable?: boolean; nodeId?: string } | null => {
  if (x < 0 || x >= MAP_CONFIG.width || y < 0 || y >= MAP_CONFIG.height) {
    return null;
  }

  const tileKey = `${x},${y}`;
  return TILES[tileKey] || { type: 'grass', walkable: true };
};

// Helper function to get map dimensions in pixels
export const getMapDimensions = () => ({
  width: MAP_CONFIG.width * MAP_CONFIG.tileSize,
  height: MAP_CONFIG.height * MAP_CONFIG.tileSize,
});

// Get all walkable tiles for character movement
export const getWalkableTiles = () => {
  const walkableTiles: Position[] = [];

  // Define tiles (grass paths, water, trees for exploration)
  const tiles: { [key: string]: { type: string; walkable?: boolean; nodeId?: string } } = {
    // Grass tiles (walkable)
    '0,0': { type: 'grass', walkable: true },
    '1,0': { type: 'grass', walkable: true },
    '2,0': { type: 'grass', walkable: true },
    '3,0': { type: 'path', walkable: true },
    '4,0': { type: 'path', walkable: true },
    '5,0': { type: 'path', walkable: true },
    '6,0': { type: 'path', walkable: true },
    '7,0': { type: 'path', walkable: true },
    '8,0': { type: 'grass', walkable: true },

    // Tree tiles (decorative)
    '1,1': { type: 'tree', walkable: false },
    '1,7': { type: 'tree', walkable: false },
    '2,7': { type: 'tree', walkable: false },
    '6,7': { type: 'tree', walkable: false },

    // Water tile (blocked)
    '4,4': { type: 'water', walkable: false },

    // Node tiles (interactive)
    '2,3': { type: 'node', walkable: true, nodeId: 'tech-blog-platform' },
    '12,2': { type: 'node', walkable: true, nodeId: 'ai-chat-assistant' },
    '6,8': { type: 'node', walkable: true, nodeId: 'weather-dashboard' },
    '14,12': { type: 'node', walkable: true, nodeId: 'freelance-platform' },
    '8,14': { type: 'node', walkable: true, nodeId: 'design-system-docs' },
  };

  Object.entries(tiles).forEach(([key, tile]) => {
    if (tile.walkable) {
      const [x, y] = key.split(',').map(Number);
      walkableTiles.push({ x, y });
    }
  });

  return walkableTiles;
};

// Check if position contains a node
export const getNodeAtPosition = (x: number, y: number): MapNode | null => {
  const tile = getTileAtPosition(x, y);
  return tile?.nodeId ? (MAP_CONFIG.nodes as any)[tile.nodeId] : null;
};

// Get neighbor positions for movement validation
export const getNeighborPositions = (x: number, y: number): Position[] => {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  directions.forEach((dir) => {
    const newX = x + dir.x;
    const newY = y + dir.y;

    if (newX >= 0 && newX < MAP_CONFIG.width && newY >= 0 && newY < MAP_CONFIG.height) {
      neighbors.push({ x: newX, y: newY });
    }
  });

  return neighbors;
};

// Complete tile map for the 16x16 grid
export const TILES: { [key: string]: { type: string; walkable: boolean; nodeId?: string } } = {
  // Generate all tiles as grass by default
  ...(() => {
    const tiles: { [key: string]: { type: string; walkable: boolean; nodeId?: string } } = {};
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        tiles[`${x},${y}`] = { type: 'grass', walkable: true };
      }
    }
    return tiles;
  })(),

  // Add path tiles
  '3,0': { type: 'path', walkable: true },
  '4,0': { type: 'path', walkable: true },
  '5,0': { type: 'path', walkable: true },
  '6,0': { type: 'path', walkable: true },
  '7,0': { type: 'path', walkable: true },

  // Add decorative tiles
  '1,1': { type: 'tree', walkable: false },
  '1,7': { type: 'tree', walkable: false },
  '2,7': { type: 'tree', walkable: false },
  '6,7': { type: 'tree', walkable: false },
  '4,4': { type: 'water', walkable: false },

  // Add node tiles
  '2,3': { type: 'node', walkable: true, nodeId: 'tech-blog-platform' },
  '12,2': { type: 'node', walkable: true, nodeId: 'ai-chat-assistant' },
  '6,8': { type: 'node', walkable: true, nodeId: 'weather-dashboard' },
  '14,12': { type: 'node', walkable: true, nodeId: 'freelance-platform' },
  '8,14': { type: 'node', walkable: true, nodeId: 'design-system-docs' },
};

// Default export for easy importing
export const defaultMapConfig = {
  ...MAP_CONFIG,
  tiles: TILES,
};