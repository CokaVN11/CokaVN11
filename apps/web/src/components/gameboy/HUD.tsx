'use client';

import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import type { GameState } from '@/types/gameboy';

interface HUDProps {
  gameState: GameState;
  onViewToggle: (view: 'gameboy' | 'classic') => void;
  onSettingsOpen: () => void;
  className?: string;
}

export function HUD({
  gameState,
  onViewToggle,
  onSettingsOpen,
  className = '',
}: HUDProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const visitedNodes = Object.values(gameState.nodes).filter((n) => n.visited).length;
  const totalNodes = Object.keys(gameState.nodes).length;

  return (
    <div className={`fixed top-4 right-4 z-40 ${className}`}>
      {/* Compact HUD */}
      <div
        className="flex items-center space-x-2 p-3 rounded-lg border-4 cursor-pointer transition-all hover:scale-105 pokemon-card gba-shadow font-pixel"
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        aria-label="Toggle game HUD"
        aria-expanded={expanded}
      >
        {/* Stats Display */}
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <span>🚶</span>
            <span>
              ({gameState.adventurer.position.x}, {gameState.adventurer.position.y})
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span>📍</span>
            <span>
              {visitedNodes}/{totalNodes}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{formatTime(gameState.progress.totalPlayTime)}</span>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div
          className="w-6 h-6 flex items-center justify-center rounded transition-transform gba-shadow-sm"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </div>
      </div>

      {/* Expanded HUD */}
      {expanded && (
        <div
          className="absolute top-full right-0 mt-2 w-80 rounded-lg border-4 p-4 space-y-4 shadow-2xl pokemon-card gba-shadow font-pixel"
        >
          {/* View Toggle */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider">View Mode</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewToggle('gameboy')}
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors pokemon-button gba-shadow-sm ${
                  gameState.ui.currentView === 'gameboy' ? 'gba-shadow' : 'opacity-60 hover:opacity-80'
                }`}
              >
                🎮 GameBoy
              </button>
              <button
                onClick={() => onViewToggle('classic')}
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors pokemon-button gba-shadow-sm ${
                  gameState.ui.currentView === 'classic' ? 'gba-shadow' : 'opacity-60 hover:opacity-80'
                }`}
              >
                📄 Classic
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider">Settings</h3>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                // Placeholder for future sound toggle implementation
                console.log('Sound toggle feature coming soon');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded border-2 transition-colors hover:opacity-80 pokemon-button gba-shadow-sm"
            >
              <div className="flex items-center space-x-2">
                {gameState.settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-sm">Sound Effects</span>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  gameState.settings.soundEnabled ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full transition-transform bg-white"
                  style={{
                    transform: gameState.settings.soundEnabled
                      ? 'translateX(24px)'
                      : 'translateX(4px)',
                  }}
                />
              </div>
            </button>

            {/* Animations Toggle */}
            <button
              onClick={() => {
                // Placeholder for future animations toggle implementation
                console.log('Animations toggle feature coming soon');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded border-2 transition-colors hover:opacity-80 pokemon-button gba-shadow-sm"
            >
              <div className="flex items-center space-x-2">
                {gameState.settings.animationsEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="text-sm">Animations</span>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  gameState.settings.animationsEnabled ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full transition-transform bg-white"
                  style={{
                    transform: gameState.settings.animationsEnabled
                      ? 'translateX(24px)'
                      : 'translateX(4px)',
                  }}
                />
              </div>
            </button>

            {/* Settings Button */}
            <button
              onClick={onSettingsOpen}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded transition-colors hover:opacity-80 pokemon-button gba-shadow"
            >
              <Settings size={16} />
              <span className="text-sm font-semibold">Advanced Settings</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider">Statistics</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">Total Interactions:</span>
                <span className="font-semibold">{gameState.progress.totalInteractions}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Nodes Discovered:</span>
                <span className="font-semibold">
                  {visitedNodes}/{totalNodes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Play Time:</span>
                <span className="font-semibold">
                  {formatTime(gameState.progress.totalPlayTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Achievements:</span>
                <span className="font-semibold">{gameState.progress.achievements.length}</span>
              </div>
            </div>
          </div>

          {/* Achievements Preview */}
          {gameState.progress.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wider">Recent Achievements</h3>
              <div className="space-y-1">
                {gameState.progress.achievements.slice(-3).map((achievement, index) => (
                  <div
                    key={achievement.id || index}
                    className="flex items-center space-x-2 text-sm p-2 rounded pokemon-card gba-shadow-sm"
                  >
                    <span>{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-xs">{achievement.name}</div>
                      <div className="opacity-70 text-xs">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HUD;