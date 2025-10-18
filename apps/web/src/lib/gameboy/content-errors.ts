/**
 * GameBoy Portfolio UI - Content Loading Errors
 *
 * Enhanced error handling for content loading with detailed error types
 * and fallback content generation
 */

import type { ContentFrontmatter } from '../../types/gameboy';

// Content loading errors
export class ContentLoadingError extends Error {
  constructor(
    message: string,
    public readonly slug: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ContentLoadingError';
  }
}

// Fallback content generator
export class FallbackContentGenerator {
  /**
   * Generate fallback content for missing MDX files
   */
  static generateFallbackContent(
    slug: string,
    errorType: 'missing' | 'invalid' | 'network'
  ): ContentFrontmatter {
    const baseContent = {
      title: this.getFallbackTitle(slug),
      description: this.getFallbackDescription(slug, errorType),
      date: new Date().toISOString().split('T')[0],
      tags: ['portfolio', 'gameboy'],
      mapNode: {
        title: this.getFallbackTitle(slug),
        description: this.getFallbackDescription(slug, errorType),
        icon: '📦',
        color: 'primary' as const,
      },
      gameData: {
        nodeType: 'project' as const,
        difficulty: 'medium' as const,
        estimatedTime: 3,
        achievements: [],
      },
    };

    switch (errorType) {
      case 'missing':
        return {
          ...baseContent,
          title: `Content Not Found: ${slug}`,
          description: `The content for "${slug}" could not be found. This might be a new project that's still being developed.`,
          tags: [...baseContent.tags, 'missing'],
        };

      case 'invalid':
        return {
          ...baseContent,
          title: `Content Error: ${slug}`,
          description: `The content for "${slug}" has formatting issues and couldn't be processed. Please check back later.`,
          tags: [...baseContent.tags, 'error'],
        };

      case 'network':
        return {
          ...baseContent,
          title: `Network Error: ${slug}`,
          description: `Unable to load content for "${slug}" due to network issues. Please check your connection and try again.`,
          tags: [...baseContent.tags, 'network-error'],
        };

      default:
        return baseContent;
    }
  }

  /**
   * Generate a fallback title from slug
   */
  private static getFallbackTitle(slug: string): string {
    return slug
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate appropriate fallback description
   */
  private static getFallbackDescription(slug: string, errorType: string): string {
    const descriptions = {
      missing: `This project is currently under development or the content is temporarily unavailable.`,
      invalid: `There was an error processing this project's content. The technical team has been notified.`,
      network: `Unable to load this project's content due to connection issues. Please try again later.`,
    };

    return descriptions[errorType as keyof typeof descriptions] || descriptions.missing;
  }

  /**
   * Generate emergency fallback for completely broken content
   */
  static generateEmergencyFallback(): ContentFrontmatter {
    return {
      title: 'Portfolio Explorer',
      description:
        'Welcome to my interactive portfolio! Navigate the map to discover projects and experiences.',
      date: new Date().toISOString().split('T')[0],
      tags: ['portfolio', 'gameboy', 'interactive'],
      mapNode: {
        title: 'Portfolio',
        description: 'Interactive portfolio explorer',
        icon: '🎮',
        color: 'primary' as const,
      },
      gameData: {
        nodeType: 'project' as const,
        difficulty: 'easy' as const,
        estimatedTime: 2,
        achievements: [],
      },
    };
  }
}
