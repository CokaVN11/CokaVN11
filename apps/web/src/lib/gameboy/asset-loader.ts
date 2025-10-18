/**
 * GameBoy Portfolio UI - Asset Loading Utilities
 *
 * Handles loading of pixel art, sprites, and other visual assets
 * Provides fallback mechanisms and error handling for asset failures
 */

import { useState, useEffect } from 'react';

// Asset loading configuration
interface AssetConfig {
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  fallbackMode: 'disabled' | 'simple' | 'emoji';
}

// Asset loading states
export type AssetLoadState = 'loading' | 'loaded' | 'error' | 'fallback';

// Asset metadata
export interface AssetMetadata {
  url?: string;
  type: 'sprite' | 'tile' | 'icon' | 'pixel-art';
  fallbackEmoji?: string;
  fallbackColor?: string;
  loadState: AssetLoadState;
  error?: string;
  attempt: number;
}

// Asset cache
const assetCache = new Map<string, AssetMetadata>();

// Default asset configuration
const DEFAULT_CONFIG: AssetConfig = {
  timeout: 5000, // 5 seconds
  retryAttempts: 2,
  retryDelay: 1000, // 1 second
  fallbackMode: 'emoji',
};

/**
 * GameBoy Asset Loader with fallback support
 */
export class GameBoyAssetLoader {
  private config: AssetConfig;

  constructor(config: Partial<AssetConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Load an image asset with fallback support
   */
  async loadImage(
    url: string,
    fallbackEmoji: string = '📦',
    fallbackColor: string = '#888888'
  ): Promise<AssetMetadata> {
    const cacheKey = `img:${url}`;

    // Check cache first
    if (assetCache.has(cacheKey)) {
      const cached = assetCache.get(cacheKey)!;
      if (cached.loadState === 'loaded') {
        return cached;
      }
    }

    const metadata: AssetMetadata = {
      url,
      type: 'sprite',
      fallbackEmoji,
      fallbackColor,
      loadState: 'loading',
      attempt: 0,
    };

    assetCache.set(cacheKey, metadata);

    try {
      await this.attemptImageLoad(url, metadata);
      return metadata;
    } catch (error) {
      return this.handleLoadFailure(url, error, fallbackEmoji, fallbackColor, 'sprite');
    }
  }

  /**
   * Load multiple assets in parallel
   */
  async loadAssets(
    assets: Array<{
      url: string;
      fallbackEmoji?: string;
      fallbackColor?: string;
    }>
  ): Promise<AssetMetadata[]> {
    const promises = assets.map((asset) =>
      this.loadImage(asset.url, asset.fallbackEmoji, asset.fallbackColor)
    );

    const results = await Promise.allSettled(promises);
    return results.map((result) =>
      result.status === 'fulfilled' ? result.value : this.createErrorAsset(result.reason)
    );
  }

  /**
   * Preload critical assets
   */
  async preloadCriticalAssets(assetUrls: string[]): Promise<void> {
    try {
      const criticalAssets = assetUrls.slice(0, 5); // Limit to first 5 assets
      await this.loadAssets(criticalAssets.map((url) => ({ url })));
      console.log('Critical assets preloaded successfully');
    } catch (error) {
      console.warn('Critical asset preloading failed:', error);
    }
  }

  /**
   * Get cached asset metadata
   */
  getAssetMetadata(url: string): AssetMetadata | undefined {
    return assetCache.get(`img:${url}`);
  }

  /**
   * Clear asset cache
   */
  clearCache(): void {
    assetCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    total: number;
    loaded: number;
    errors: number;
    fallbacks: number;
  } {
    const assets = Array.from(assetCache.values());
    return {
      total: assets.length,
      loaded: assets.filter((a) => a.loadState === 'loaded').length,
      errors: assets.filter((a) => a.loadState === 'error').length,
      fallbacks: assets.filter((a) => a.loadState === 'fallback').length,
    };
  }

  /**
   * Attempt to load an image with timeout
   */
  private async attemptImageLoad(url: string, metadata: AssetMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = ''; // Cancel loading
        reject(new Error(`Asset loading timeout: ${url}`));
      }, this.config.timeout);

      img.onload = () => {
        clearTimeout(timeout);
        metadata.loadState = 'loaded';
        assetCache.set(`img:${url}`, metadata);
        console.log(`Asset loaded successfully: ${url}`);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Asset load error: ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * Handle asset loading failures with retries
   */
  private async retryLoadWithBackoff(url: string, metadata: AssetMetadata): Promise<void> {
    metadata.attempt++;

    if (metadata.attempt > this.config.retryAttempts) {
      throw new Error(`Max retry attempts exceeded for: ${url}`);
    }

    // Exponential backoff
    const delay = this.config.retryDelay * Math.pow(2, metadata.attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.attemptImageLoad(url, metadata);
  }

  /**
   * Handle loading failure and create fallback asset
   */
  private handleLoadFailure(
    url: string,
    error: unknown,
    fallbackEmoji: string,
    fallbackColor: string,
    assetType: 'sprite' | 'tile' | 'icon' | 'pixel-art'
  ): AssetMetadata {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Asset loading failed: ${url}`, errorMessage);

    const metadata: AssetMetadata = {
      url,
      type: assetType,
      fallbackEmoji,
      fallbackColor,
      loadState: this.config.fallbackMode === 'disabled' ? 'error' : 'fallback',
      error: errorMessage,
      attempt: 0,
    };

    assetCache.set(`img:${url}`, metadata);

    // Track asset loading failures for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'asset_load_error', {
        asset_url: url,
        asset_type: assetType,
        error_message: errorMessage,
        fallback_used: this.config.fallbackMode,
      });
    }

    return metadata;
  }

  /**
   * Create error asset metadata
   */
  private createErrorAsset(error: any): AssetMetadata {
    return {
      type: 'sprite',
      fallbackEmoji: '❌',
      fallbackColor: '#ff4444',
      loadState: 'error',
      error: error.message || 'Unknown error',
      attempt: 0,
    };
  }

  /**
   * Generate fallback CSS for asset
   */
  generateFallbackCSS(metadata: AssetMetadata): React.CSSProperties {
    if (metadata.loadState === 'loaded' && metadata.url) {
      return {
        backgroundImage: `url(${metadata.url})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    }

    if (this.config.fallbackMode === 'emoji' && metadata.fallbackEmoji) {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: metadata.fallbackColor || '#888888',
      };
    }

    if (this.config.fallbackMode === 'simple' && metadata.fallbackColor) {
      return {
        backgroundColor: metadata.fallbackColor,
        border: `2px solid ${metadata.fallbackColor}`,
        borderRadius: '4px',
      };
    }

    // Disabled fallback mode - show error indicator
    return {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '2px dashed #ff4444',
      borderRadius: '4px',
    };
  }

  /**
   * Generate fallback content for asset
   */
  generateFallbackContent(metadata: AssetMetadata): string {
    if (metadata.loadState === 'loaded') {
      return ''; // Will use CSS background image
    }

    if (this.config.fallbackMode === 'emoji' && metadata.fallbackEmoji) {
      return metadata.fallbackEmoji;
    }

    if (metadata.loadState === 'error') {
      return '❌';
    }

    return '';
  }
}

// Export singleton instance
export const assetLoader = new GameBoyAssetLoader();

/**
 * React hook for loading assets with fallback support
 */
export function useAssetLoader(url: string, fallbackEmoji?: string, fallbackColor?: string) {
  const [asset, setAsset] = useState<AssetMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAsset = async () => {
      setIsLoading(true);
      try {
        const loadedAsset = await assetLoader.loadImage(url, fallbackEmoji, fallbackColor);
        if (isMounted) {
          setAsset(loadedAsset);
        }
      } catch (error) {
        console.error('Asset loading failed:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAsset();

    return () => {
      isMounted = false;
    };
  }, [url, fallbackEmoji, fallbackColor]);

  return {
    asset,
    isLoading,
    css: asset ? assetLoader.generateFallbackCSS(asset) : {},
    content: asset ? assetLoader.generateFallbackContent(asset) : '',
    retry: () => assetLoader.loadImage(url, fallbackEmoji, fallbackColor),
  };
}
