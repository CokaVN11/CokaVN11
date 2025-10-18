/**
 * GameBoy Portfolio UI - Achievement System
 *
 * Achievement tracking and unlocking logic with various rarity levels
 * and automatic progress monitoring
 */

import type { Achievement } from '../../types/gameboy';

// Achievement definitions
export const ACHIEVEMENTS: Record<
  string,
  Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>
> = {
  // Exploration achievements
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Take your first step in the portfolio world',
    icon: '👣',
    rarity: 'common',
    category: 'exploration',
    criteria: {
      type: 'move',
      target: 1,
    },
    rewards: {
      theme: 'fire' as const, // Updated from 'classic' to 'fire' for Pokemon theme
    },
  },

  world_explorer: {
    id: 'world_explorer',
    name: 'World Explorer',
    description: 'Visit every corner of the 16×16 map',
    icon: '🗺️',
    rarity: 'uncommon',
    category: 'exploration',
    criteria: {
      type: 'visit_tiles',
      target: 50, // Visit 50 different tiles
    },
    rewards: {
      theme: 'leaf' as const, // Updated from 'autumn' to 'leaf' for Pokemon theme
    },
  },

  // Node interaction achievements
  first_discovery: {
    id: 'first_discovery',
    name: 'First Discovery',
    description: 'Discover your first project or experience',
    icon: '💡',
    rarity: 'common',
    category: 'interaction',
    criteria: {
      type: 'discover_nodes',
      target: 1,
    },
  },

  project_explorer: {
    id: 'project_explorer',
    name: 'Project Explorer',
    description: 'Discover all projects on the map',
    icon: '📁',
    rarity: 'uncommon',
    category: 'interaction',
    criteria: {
      type: 'discover_projects',
      target: 3, // All 3 projects
    },
    rewards: {
      theme: 'leaf' as const, // Updated from 'ocean' to 'leaf' for Pokemon theme
    },
  },

  experience_seeker: {
    id: 'experience_seeker',
    name: 'Experience Seeker',
    description: 'Discover all experiences on the map',
    icon: '🎓',
    rarity: 'uncommon',
    category: 'interaction',
    criteria: {
      type: 'discover_experiences',
      target: 2, // All 2 experiences
    },
    rewards: {
      theme: 'leaf' as const, // Updated from 'forest' to 'leaf' for Pokemon theme
    },
  },

  completionist: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Discover all nodes on the map',
    icon: '🏆',
    rarity: 'rare',
    category: 'interaction',
    criteria: {
      type: 'discover_all_nodes',
      target: 5, // All 5 nodes
    },
    rewards: {
      theme: 'leaf' as const, // Updated from 'sunset' to 'leaf' for Pokemon theme
    },
  },

  // Interaction achievements
  curious_mind: {
    id: 'curious_mind',
    name: 'Curious Mind',
    description: 'Interact with 10 different nodes',
    icon: '🔍',
    rarity: 'uncommon',
    category: 'interaction',
    criteria: {
      type: 'interact_count',
      target: 10,
    },
  },

  portfolio_master: {
    id: 'portfolio_master',
    name: 'Portfolio Master',
    description: 'Interact with every node multiple times',
    icon: '🎯',
    rarity: 'rare',
    category: 'interaction',
    criteria: {
      type: 'interact_all_nodes',
      target: 3, // Interact with each node at least 3 times
    },
  },

  // Time-based achievements
  quick_learner: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Discover all nodes within 2 minutes',
    icon: '⚡',
    rarity: 'rare',
    category: 'completion',
    criteria: {
      type: 'complete_fast',
      target: 120000, // 2 minutes in milliseconds
      conditions: {
        nodes_discovered: 5,
      },
    },
  },

  dedicated_explorer: {
    id: 'dedicated_explorer',
    name: 'Dedicated Explorer',
    description: 'Spend 5 minutes exploring the portfolio',
    icon: '⏰',
    rarity: 'uncommon',
    category: 'completion',
    criteria: {
      type: 'time_played',
      target: 300000, // 5 minutes in milliseconds
    },
  },

  // Special achievements
  theme_explorer: {
    id: 'theme_explorer',
    name: 'Theme Explorer',
    description: 'Try both Pokemon FireRed and LeafGreen themes',
    icon: '🎨',
    rarity: 'uncommon',
    category: 'special',
    criteria: {
      type: 'try_all_themes',
      target: 2, // Updated from 5 to 2 for Pokemon themes
    },
  },

  view_switcher: {
    id: 'view_switcher',
    name: 'View Switcher',
    description: 'Switch between GameBoy and Classic views',
    icon: '🔄',
    rarity: 'common',
    category: 'special',
    criteria: {
      type: 'switch_views',
      target: 1,
    },
  },

  // Legendary achievements
  portfolio_legend: {
    id: 'portfolio_legend',
    name: 'Portfolio Legend',
    description: 'Complete all other achievements',
    icon: '👑',
    rarity: 'legendary',
    category: 'completion',
    criteria: {
      type: 'complete_all_achievements',
      target: 1,
    },
    rewards: {
      theme: 'fire' as const, // Updated from 'classic' to 'fire' for Pokemon theme
      badge: 'legend' as const,
    },
  },

  speed_runner: {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Discover all nodes in under 60 seconds',
    icon: '🏃',
    rarity: 'legendary',
    category: 'completion',
    criteria: {
      type: 'complete_very_fast',
      target: 60000, // 1 minute in milliseconds
      conditions: {
        nodes_discovered: 5,
      },
    },
  },
};

// Achievement checker class
export class AchievementSystem {
  private static instance: AchievementSystem;
  private visitedTiles: Set<string> = new Set();
  private interactedNodes: Map<string, number> = new Map();
  private discoveredProjects: Set<string> = new Set();
  private discoveredExperiences: Set<string> = new Set();
  private triedPalettes: Set<string> = new Set();
  private sessionStartTime: number = Date.now();

  static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  // Track visited tiles
  trackTileVisit(x: number, y: number) {
    const tileKey = `${x},${y}`;
    this.visitedTiles.add(tileKey);
  }

  // Track node interactions
  trackNodeInteraction(nodeId: string, nodeType: 'project' | 'experience') {
    const currentCount = this.interactedNodes.get(nodeId) || 0;
    this.interactedNodes.set(nodeId, currentCount + 1);

    if (nodeType === 'project') {
      this.discoveredProjects.add(nodeId);
    } else {
      this.discoveredExperiences.add(nodeId);
    }
  }

  // Track theme changes (updated from palette tracking)
  trackPaletteChange(themeName: string) {
    this.triedPalettes.add(themeName);
  }

  // Check achievements based on current game state
  checkAchievements(gameState: any): string[] {
    const unlockedAchievements: string[] = [];

    for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (this.isAchievementUnlocked(achievementId, gameState)) {
        unlockedAchievements.push(achievementId);
      }
    }

    return unlockedAchievements;
  }

  // Check if a specific achievement is unlocked
  private isAchievementUnlocked(achievementId: string, gameState: any): boolean {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement?.criteria) return false;

    const { type, target, conditions = {} } = achievement.criteria;

    switch (type) {
      case 'move':
        return gameState.progress.totalInteractions >= (target || 0);

      case 'visit_tiles':
        return this.visitedTiles.size >= (target || 0);

      case 'discover_nodes':
        return this.getDiscoveredNodesCount(gameState) >= (target || 0);

      case 'discover_projects':
        return this.discoveredProjects.size >= (target || 0);

      case 'discover_experiences':
        return this.discoveredExperiences.size >= (target || 0);

      case 'discover_all_nodes':
        return this.getDiscoveredNodesCount(gameState) >= (target || 0);

      case 'interact_count':
        return gameState.progress.totalInteractions >= (target || 0);

      case 'interact_all_nodes':
        return this.checkAllNodesInteracted(target || 0);

      case 'complete_fast':
      case 'complete_very_fast':
        const playTime = Date.now() - this.sessionStartTime;
        return (
          this.getDiscoveredNodesCount(gameState) >= (conditions?.nodes_discovered || 0) &&
          playTime <= (target || 0)
        );

      case 'time_played':
        return gameState.progress.totalPlayTime >= (target || 0);

      case 'try_all_themes':
        return this.triedPalettes.size >= (target || 0);

      case 'switch_views':
        return gameState.ui.currentView !== 'gameboy';

      case 'complete_all_achievements':
        const totalAchievements = Object.keys(ACHIEVEMENTS).length - 1; // Exclude this achievement itself
        return gameState.progress.achievements.length >= totalAchievements;

      default:
        return false;
    }
  }

  // Helper methods
  private getDiscoveredNodesCount(gameState: any): number {
    return Object.values(gameState.nodes).filter((node: any) => node.discovered).length;
  }

  private checkAllNodesInteracted(targetCount: number): boolean {
    for (const count of this.interactedNodes.values()) {
      if (count < targetCount) {
        return false;
      }
    }
    return this.interactedNodes.size >= targetCount;
  }

  // Get achievement by ID
  getAchievement(
    achievementId: string
  ): Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'> | null {
    return ACHIEVEMENTS[achievementId] || null;
  }

  // Get all achievements
  getAllAchievements(): Record<
    string,
    Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>
  > {
    return ACHIEVEMENTS;
  }

  // Get achievements by category
  getAchievementsByCategory(
    category: Achievement['category']
  ): Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>[] {
    return Object.values(ACHIEVEMENTS).filter((a) => a.category === category);
  }

  // Get achievements by rarity
  getAchievementsByRarity(
    rarity: Achievement['rarity']
  ): Omit<Achievement, 'unlockedAt' | 'progress' | 'maxProgress'>[] {
    return Object.values(ACHIEVEMENTS).filter((a) => a.rarity === rarity);
  }

  // Calculate achievement progress
  getAchievementProgress(achievementId: string, gameState: any): number {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement?.criteria) return 0;

    const { type, target, conditions = {} } = achievement.criteria;

    switch (type) {
      case 'move':
        return Math.min(gameState.progress.totalInteractions, target || 0);

      case 'visit_tiles':
        return Math.min(this.visitedTiles.size, target || 0);

      case 'discover_nodes':
        return Math.min(this.getDiscoveredNodesCount(gameState), target || 0);

      case 'discover_projects':
        return Math.min(this.discoveredProjects.size, target || 0);

      case 'discover_experiences':
        return Math.min(this.discoveredExperiences.size, target || 0);

      case 'discover_all_nodes':
        return Math.min(this.getDiscoveredNodesCount(gameState), target || 0);

      case 'interact_count':
        return Math.min(gameState.progress.totalInteractions, target || 0);

      case 'interact_all_nodes':
        const interactions = Array.from(this.interactedNodes.values());
        const minInteractions = interactions.length > 0 ? Math.min(...interactions) : 0;
        return Math.min(minInteractions, target || 0);

      case 'time_played':
        return Math.min(gameState.progress.totalPlayTime, target || 0);

      case 'try_all_themes':
        return Math.min(this.triedPalettes.size, target || 0);

      default:
        return 0;
    }
  }

  // Reset achievement tracking (for testing or new game)
  reset(): void {
    this.visitedTiles.clear();
    this.interactedNodes.clear();
    this.discoveredProjects.clear();
    this.discoveredExperiences.clear();
    this.triedPalettes.clear();
    this.sessionStartTime = Date.now();
  }
}

// Export singleton instance
export const achievementSystem = AchievementSystem.getInstance();

// Helper functions for common achievement checks
export const checkMovementAchievement = (
  gameState: any,
  achievementSystem: AchievementSystem
): string[] => {
  return achievementSystem.checkAchievements(gameState).filter((id) => {
    const achievement = ACHIEVEMENTS[id];
    return achievement?.criteria?.type === 'move' || achievement?.criteria?.type === 'visit_tiles';
  });
};

export const checkInteractionAchievement = (
  gameState: any,
  achievementSystem: AchievementSystem
): string[] => {
  return achievementSystem.checkAchievements(gameState).filter((id) => {
    const achievement = ACHIEVEMENTS[id];
    return (
      achievement?.criteria &&
      [
        'discover_nodes',
        'discover_projects',
        'discover_experiences',
        'discover_all_nodes',
        'interact_count',
        'interact_all_nodes',
      ].includes(achievement.criteria.type)
    );
  });
};

export const checkTimeAchievement = (
  gameState: any,
  achievementSystem: AchievementSystem
): string[] => {
  return achievementSystem.checkAchievements(gameState).filter((id) => {
    const achievement = ACHIEVEMENTS[id];
    return (
      achievement?.criteria &&
      ['complete_fast', 'complete_very_fast', 'time_played'].includes(achievement.criteria.type)
    );
  });
};

export const checkSpecialAchievement = (
  gameState: any,
  achievementSystem: AchievementSystem
): string[] => {
  return achievementSystem.checkAchievements(gameState).filter((id) => {
    const achievement = ACHIEVEMENTS[id];
    return achievement?.category === 'special' || achievement?.category === 'completion';
  });
};