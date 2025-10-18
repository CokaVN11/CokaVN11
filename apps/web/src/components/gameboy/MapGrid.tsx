'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useGameState, useGameStateActions } from '@/hooks/useGameState';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { defaultMapConfig } from '@/lib/gameboy/map-config';
import { gameContentLoader } from '@/lib/gameboy/content-loader';
import { achievementSystem } from '@/lib/gameboy/achievements';
import type { Position, MapNode, ContentFrontmatter } from '@/types/gameboy';
import CasePanel from './CasePanel';
import HUD from './HUD';
import MobileControls from './MobileControls';
import Toasts from './Toasts';
import './MapGrid.css';

interface MapGridProps {
  className?: string;
}

export function MapGrid({ className = '' }: MapGridProps) {
  const { gameState, moveCharacter, interactWithNode } = useGameStateActions();
  const { theme, setTheme } = useTheme();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [panelContent, setPanelContent] = useState<ContentFrontmatter | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useKeyboardControls({
    onMove: useCallback(
      (direction: 'up' | 'down' | 'left' | 'right') => {
        const { x, y } = gameState.adventurer.position;
        let newX = x;
        let newY = y;

        switch (direction) {
          case 'up':
            newY = Math.max(0, y - 1);
            break;
          case 'down':
            newY = Math.min(15, y + 1);
            break;
          case 'left':
            newX = Math.max(0, x - 1);
            break;
          case 'right':
            newX = Math.min(15, x + 1);
            break;
        }

        // Check if the new position is walkable
        const positionKey = `${newX},${newY}`;
        const tile = defaultMapConfig.tiles[positionKey];

        if (tile && tile.walkable) {
          moveCharacter(newX, newY);

          // Track tile visit for achievements
          achievementSystem.trackTileVisit(newX, newY);

          // Check for movement achievements
          const movementAchievements = achievementSystem.checkAchievements(gameState);
          movementAchievements.forEach((achievementId) => {
            useGameState.getState().unlockAchievement(achievementId);
          });
        }
      },
      [gameState.adventurer.position, moveCharacter]
    ),

    onInteract: useCallback(async () => {
      const { x, y } = gameState.adventurer.position;

      // Check if there's a node at the current position
      const currentNode = Object.values(defaultMapConfig.nodes).find(
        (node) => node.position.x === x && node.position.y === y
      );

      if (currentNode) {
        // Mark node as visited and update interactions
        interactWithNode(currentNode.id);

        // Track node interaction for achievements
        achievementSystem.trackNodeInteraction(currentNode.id, currentNode.type);

        // Check for interaction achievements
        const interactionAchievements = achievementSystem.checkAchievements(gameState);
        interactionAchievements.forEach((achievementId) => {
          useGameState.getState().unlockAchievement(achievementId);
        });

        // Open panel and load content
        setActivePanel(currentNode.id);
        setIsLoadingContent(true);
        setPanelContent(null);

        try {
          const content = await gameContentLoader.getContentBySlug(currentNode.mdxSlug);
          if (content) {
            setPanelContent(content);
          } else {
            // Create fallback content if MDX content not found
            setPanelContent({
              title: currentNode.title,
              description: currentNode.description,
              date: new Date().toISOString().split('T')[0],
              tags: ['portfolio', 'gameboy'],
              mapNode: {
                title: currentNode.title,
                description: currentNode.description,
                icon: '📦',
                color: 'primary' as const,
              },
              gameData: {
                nodeType: currentNode.type,
                difficulty: 'medium' as const,
                estimatedTime: 5,
                achievements: [],
              },
            });
          }
        } catch (error) {
          console.error('Failed to load content:', error);
          // Set fallback content on error
          setPanelContent({
            title: currentNode.title,
            description: currentNode.description,
            date: new Date().toISOString().split('T')[0],
            tags: ['portfolio', 'gameboy'],
            mapNode: {
              title: currentNode.title,
              description: currentNode.description,
              icon: '📦',
              color: 'primary' as const,
            },
            gameData: {
              nodeType: currentNode.type,
              difficulty: 'medium' as const,
              estimatedTime: 5,
              achievements: [],
            },
          });
        } finally {
          setIsLoadingContent(false);
        }
      }
    }, [gameState.adventurer.position, interactWithNode]),
  });

  // Handle focus for keyboard accessibility
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.focus();
    }
  }, []);

  // Check for time-based achievements periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const timeAchievements = achievementSystem.checkAchievements(gameState);
      timeAchievements.forEach((achievementId) => {
        useGameState.getState().unlockAchievement(achievementId);
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [gameState]);

  // Check achievements when nodes are discovered
  useEffect(() => {
    const discoveredCount = Object.values(gameState.nodes).filter(
      (node: any) => node.discovered
    ).length;
    if (discoveredCount > 0) {
      const discoveryAchievements = achievementSystem.checkAchievements(gameState);
      discoveryAchievements.forEach((achievementId) => {
        useGameState.getState().unlockAchievement(achievementId);
      });
    }
  }, [gameState.nodes]);

  // Get tile type and node information for a position
  const getTileInfo = useCallback(
    (x: number, y: number) => {
      const positionKey = `${x},${y}`;
      const tile = defaultMapConfig.tiles[positionKey];
      const node = Object.values(defaultMapConfig.nodes).find(
        (n) => n.position.x === x && n.position.y === y
      );
      const isCharacter =
        gameState.adventurer.position.x === x && gameState.adventurer.position.y === y;

      return { tile, node, isCharacter };
    },
    [gameState.adventurer.position]
  );

  // Handle theme change
  const handleThemeChange = (newTheme: 'fire' | 'leaf') => {
    setTheme(newTheme);
    
    // Track theme change for achievements
    achievementSystem.trackPaletteChange(newTheme);
    
    // Check for special achievements
    const specialAchievements = achievementSystem.checkAchievements(gameState);
    specialAchievements.forEach((achievementId) => {
      useGameState.getState().unlockAchievement(achievementId);
    });
  };

  // Handle panel close
  const handlePanelClose = () => {
    setActivePanel(null);
    setPanelContent(null);
  };

  // Handle view toggle
  const handleViewToggle = (view: 'gameboy' | 'classic') => {
    useGameState.getState().setCurrentView(view);
  };

  // Handle settings open (placeholder for future implementation)
  const handleSettingsOpen = () => {
    // Placeholder for future settings modal implementation
    console.log('Settings modal not yet implemented');
    // Could dispatch event to parent or use state management
  };

  // Handle mobile controls movement
  const handleMobileMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      const { x, y } = gameState.adventurer.position;
      let newX = x;
      let newY = y;

      switch (direction) {
        case 'up':
          newY = Math.max(0, y - 1);
          break;
        case 'down':
          newY = Math.min(15, y + 1);
          break;
        case 'left':
          newX = Math.max(0, x - 1);
          break;
        case 'right':
          newX = Math.min(15, x + 1);
          break;
      }

      // Check if the new position is walkable
      const positionKey = `${newX},${newY}`;
      const tile = defaultMapConfig.tiles[positionKey];

      if (tile && tile.walkable) {
        moveCharacter(newX, newY);
      }
    },
    [gameState.adventurer.position, moveCharacter]
  );

  // Handle mobile controls interaction
  const handleMobileInteract = useCallback(async () => {
    const { x, y } = gameState.adventurer.position;

    // Check if there's a node at the current position
    const currentNode = Object.values(defaultMapConfig.nodes).find(
      (node) => node.position.x === x && node.position.y === y
    );

    if (currentNode) {
      // Mark node as visited and update interactions
      interactWithNode(currentNode.id);

      // Open panel and load content
      setActivePanel(currentNode.id);
      setIsLoadingContent(true);
      setPanelContent(null);

      try {
        const content = await gameContentLoader.getContentBySlug(currentNode.mdxSlug);
        if (content) {
          setPanelContent(content);
        } else {
          // Create fallback content if MDX content not found
          setPanelContent({
            title: currentNode.title,
            description: currentNode.description,
            date: new Date().toISOString().split('T')[0],
            tags: ['portfolio', 'gameboy'],
            mapNode: {
              title: currentNode.title,
              description: currentNode.description,
              icon: '📦',
              color: 'primary' as const,
            },
            gameData: {
              nodeType: currentNode.type,
              difficulty: 'medium' as const,
              estimatedTime: 5,
              achievements: [],
            },
          });
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        // Set fallback content on error
        setPanelContent({
          title: currentNode.title,
          description: currentNode.description,
          date: new Date().toISOString().split('T')[0],
          tags: ['portfolio', 'gameboy'],
          mapNode: {
            title: currentNode.title,
            description: currentNode.description,
            icon: '📦',
            color: 'primary' as const,
          },
          gameData: {
            nodeType: currentNode.type,
            difficulty: 'medium' as const,
            estimatedTime: 5,
            achievements: [],
          },
        });
      } finally {
        setIsLoadingContent(false);
      }
    }
  }, [gameState.adventurer.position, interactWithNode]);

  // Get current node for panel
  const currentNode = activePanel ? (defaultMapConfig.nodes as any)[activePanel] : null;

  return (
    <div
      className={`gameboy-map-grid pokemon-card font-pixel ${className}`}
      ref={gridRef}
      tabIndex={0}
      role="application"
      aria-label="GameBoy portfolio map navigation"
    >
      {/* Game Header */}
      <div className="game-header">
        <h1 className="game-title">Portfolio Explorer</h1>
        <div className="palette-selector">
          <span className="palette-label">Theme:</span>
          {(['fire', 'leaf'] as const).map((themeName) => (
            <button
              key={themeName}
              className={`palette-btn pokemon-button font-pixel ${theme === themeName ? 'gba-shadow' : ''}`}
              onClick={() => handleThemeChange(themeName)}
              aria-label={`Switch to ${themeName} theme`}
              aria-pressed={theme === themeName}
            >
              {themeName === 'fire' ? '🔥 Fire' : '🍃 Leaf'}
            </button>
          ))}
        </div>
      </div>

      {/* Map Grid */}
      <div className="map-container">
        <div className="map-grid">
          {Array.from({ length: 16 }, (_, y) =>
            Array.from({ length: 16 }, (_, x) => {
              const { tile, node, isCharacter } = getTileInfo(x, y);
              const isVisited = node && gameState.nodes[node.id]?.visited;
              const isDiscovered = node && gameState.nodes[node.id]?.discovered;

              return (
                <motion.div
                  key={`${x}-${y}`}
                  className={`tile ${isCharacter ? 'character' : ''} ${node ? 'node' : ''} ${
                    isVisited ? 'visited' : ''
                  } ${isDiscovered ? 'discovered' : ''}`}
                  data-x={x}
                  data-y={y}
                  data-tile-type={tile?.type || 'grass'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isCharacter ? 1.1 : 1,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {isCharacter && (
                    <motion.div
                      className="character-sprite"
                      animate={{
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 2, repeat: Infinity },
                      }}
                    >
                      🚶
                    </motion.div>
                  )}

                  {node && !isCharacter && (
                    <motion.div
                      className={`node-sprite ${isVisited ? 'visited' : ''}`}
                      animate={{
                        y: isVisited ? [0, -2, 0] : 0,
                        transition: { duration: 1, repeat: isVisited ? Infinity : 0 },
                      }}
                    >
                      {isVisited ? '✅' : '📍'}
                    </motion.div>
                  )}

                  {/* Tile decoration for non-node tiles */}
                  {!isCharacter && !node && tile?.type !== 'grass' && (
                    <div className="tile-decoration">
                      {tile?.type === 'tree' && '🌲'}
                      {tile?.type === 'water' && '🌊'}
                      {tile?.type === 'mountain' && '⛰️'}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Game Controls HUD */}
      <div className="game-hud">
        <div className="stats">
          <span className="stat">
            Position: ({gameState.adventurer.position.x}, {gameState.adventurer.position.y})
          </span>
          <span className="stat">
            Nodes Visited: {Object.values(gameState.nodes).filter((n) => n.visited).length}/
            {Object.keys(defaultMapConfig.nodes).length}
          </span>
          <span className="stat">Interactions: {gameState.progress.totalInteractions}</span>
        </div>

        <div className="controls-info">
          <div className="control-group">
            <span className="control-label">Movement:</span>
            <span className="control-keys">↑↓←→ or WASD</span>
          </div>
          <div className="control-group">
            <span className="control-label">Interact:</span>
            <span className="control-keys">Enter or Space</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <p>
          Navigate the map to discover projects and experiences. Walk over nodes and press Enter to
          interact with them.
        </p>
      </div>

      {/* HUD Component */}
      <HUD
        gameState={gameState}
        onViewToggle={handleViewToggle}
        onSettingsOpen={handleSettingsOpen}
      />

      {/* Case Panel */}
      <CasePanel
        isOpen={!!activePanel}
        node={currentNode}
        content={panelContent}
        onClose={handlePanelClose}
      />

      {/* Mobile Controls */}
      <MobileControls
        onMove={handleMobileMove}
        onInteract={handleMobileInteract}
        disabled={!!activePanel}
      />

      {/* Achievement Toasts */}
      <Toasts />
    </div>
  );
}