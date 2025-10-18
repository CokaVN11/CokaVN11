/**
 * GameBoy Portfolio UI - Content Loading Utilities
 *
 * Simple MDX content loading and processing for game integration
 * Works with static MDX files in the repository
 */

import type { ContentFrontmatter, MapNode } from '../../types/gameboy';
import { MAP_CONFIG } from './map-config';
import { FallbackContentGenerator, ContentLoadingError } from './content-errors';

// Content loading interface
export interface ContentLoader {
  // Fetch all nodes for map generation
  getAllNodes(): Promise<MapNode[]>;

  // Fetch specific content by slug
  getContentBySlug(slug: string): Promise<ContentFrontmatter | null>;

  // Search content functionality
  searchContent(query: string): Promise<ContentFrontmatter[]>;

  // Validate content
  validateNode(node: MapNode): Promise<boolean>;
  validateContent(content: ContentFrontmatter): Promise<boolean>;

  // Cache management
  clearCache(): void;
  preloadNodes(nodeIds: string[]): Promise<void>;
}

// MDX frontmatter processor
export class MDXProcessor {
  /**
   * Process MDX content and extract GameBoy integration metadata
   */
  static processFrontmatter(frontmatter: Record<string, any>): ContentFrontmatter {
    // Extract existing fields with defaults
    return {
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description || '',
      date: frontmatter.date || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],

      // GameBoy integration fields
      mapNode: frontmatter.mapNode
        ? {
            title: frontmatter.mapNode.title || frontmatter.title,
            description: frontmatter.mapNode.description || frontmatter.description,
            icon: frontmatter.mapNode.icon || '📦',
            color: frontmatter.mapNode.color || 'primary',
          }
        : {
            title: frontmatter.title,
            description: frontmatter.description,
            icon: '📦',
            color: 'primary',
          },

      gameData: frontmatter.gameData
        ? {
            nodeType: frontmatter.gameData.nodeType || 'project',
            difficulty: frontmatter.gameData.difficulty || 'medium',
            estimatedTime: frontmatter.gameData.estimatedTime || 5,
            achievements: Array.isArray(frontmatter.gameData.achievements)
              ? frontmatter.gameData.achievements
              : [],
          }
        : {
            nodeType: 'project',
            difficulty: 'medium',
            estimatedTime: 5,
            achievements: [],
          },
    };
  }

  /**
   * Validate frontmatter for GameBoy compatibility
   */
  static validateFrontmatter(frontmatter: Record<string, any>): boolean {
    const required = ['title', 'description'];
    const missing = required.filter((field) => !frontmatter[field]);

    if (missing.length > 0) {
      console.warn('MDX frontmatter validation:', missing);
      return false;
    }

    return true;
  }
}

// Content loader implementation
export class GameContentLoader implements ContentLoader {
  private cache = new Map<string, ContentFrontmatter>();
  private nodeCache = new Map<string, MapNode>();

  /**
   * Fetch all available nodes for map generation
   */
  async getAllNodes(): Promise<MapNode[]> {
    try {
      // Generate nodes from MAP_CONFIG (static configuration)
      const mockNodes: MapNode[] = Object.entries(MAP_CONFIG.nodes).map(([nodeId, config]) => ({
        id: nodeId,
        type: config.type,
        position: config.position,
        title: config.title,
        description: config.description,
        mdxSlug: nodeId, // Use ID as slug for content loading
      }));

      // Cache the results
      mockNodes.forEach((node) => this.nodeCache.set(node.id, node));

      return mockNodes;
    } catch (error) {
      console.error('Failed to load content nodes:', error);
      throw new ContentLoadingError(
        `Content loading failed: ${error}`,
        'all-nodes',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Fetch specific content by slug with simple error handling
   */
  async getContentBySlug(slug: string): Promise<ContentFrontmatter | null> {
    try {
      // Check cache first
      if (this.cache.has(slug)) {
        return this.cache.get(slug) || null;
      }

      // Validate input
      if (!slug || typeof slug !== 'string') {
        console.warn('Invalid slug provided:', slug);
        const fallback = FallbackContentGenerator.generateFallbackContent('unknown', 'invalid');
        this.cache.set('unknown', fallback);
        return fallback;
      }

      // Check if node exists in map configuration
      if (!(MAP_CONFIG.nodes as any)[slug]) {
        console.warn(`Node "${slug}" not found in map configuration`);
        const fallback = FallbackContentGenerator.generateFallbackContent(slug, 'missing');
        this.cache.set(slug, fallback);
        return fallback;
      }

      // Generate mock content based on MAP_CONFIG
      const mockContent = this.generateMockContent(slug);

      // Validate the generated content
      const isValid = await this.validateContent(mockContent);
      if (!isValid) {
        console.warn(`Generated content for "${slug}" failed validation`);
        const fallback = FallbackContentGenerator.generateFallbackContent(slug, 'invalid');
        this.cache.set(slug, fallback);
        return fallback;
      }

      this.cache.set(slug, mockContent);
      return mockContent;
    } catch (error) {
      console.error('Failed to load content:', error);

      // Generate appropriate fallback based on error
      let errorType: 'missing' | 'invalid' | 'network' = 'invalid';
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          errorType = 'missing';
        }
      }

      const fallback = FallbackContentGenerator.generateFallbackContent(slug, errorType);
      this.cache.set(slug, fallback);

      // Track the error for debugging
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'content_loading_error', {
          slug: slug,
          error_type: errorType,
          error_message: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      return fallback;
    }
  }

  /**
   * Generate mock content for demonstration
   */
  private generateMockContent(slug: string): ContentFrontmatter {
    const nodeConfig = (MAP_CONFIG.nodes as any)[slug];

    return {
      title: nodeConfig.title,
      description: nodeConfig.description,
      date: new Date().toISOString().split('T')[0],
      tags: ['portfolio', 'web-development'],
      mapNode: nodeConfig.mapNode,
      gameData: {
        nodeType: nodeConfig.type,
        difficulty: 'medium' as const,
        estimatedTime: 5,
        achievements: [],
      },
    };
  }

  /**
   * Search content across all available content
   */
  async searchContent(query: string): Promise<ContentFrontmatter[]> {
    try {
      const lowerQuery = query.toLowerCase();
      const results: ContentFrontmatter[] = [];

      Object.values(MAP_CONFIG.nodes).forEach((node) => {
        if (
          node.title.toLowerCase().includes(lowerQuery) ||
          node.description?.toLowerCase().includes(lowerQuery)
        ) {
          results.push(this.generateMockContent(node.id));
        }
      });

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      throw new ContentLoadingError(
        `Search failed: ${error}`,
        'search',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Validate node configuration
   */
  async validateNode(node: MapNode): Promise<boolean> {
    try {
      return !!node.id && !!node.title && !!node.mdxSlug;
    } catch (error) {
      console.error('Node validation failed:', error);
      return false;
    }
  }

  /**
   * Validate content structure
   */
  async validateContent(content: ContentFrontmatter): Promise<boolean> {
    try {
      return MDXProcessor.validateFrontmatter(content);
    } catch (error) {
      console.error('Content validation failed:', error);
      return false;
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    this.nodeCache.clear();
  }

  /**
   * Preload content for specific nodes
   */
  async preloadNodes(nodeIds: string[]): Promise<void> {
    try {
      const nodeIdsToLoad = nodeIds.filter((id) => !this.nodeCache.has(id));

      for (const nodeId of nodeIdsToLoad) {
        await this.getContentBySlug(nodeId);
      }
    } catch (error) {
      console.error('Content preloading failed:', error);
    }
  }
}

// Export singleton instance
export const gameContentLoader = new GameContentLoader();
