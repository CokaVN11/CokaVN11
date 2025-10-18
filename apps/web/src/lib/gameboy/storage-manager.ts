/**
 * GameBoy Portfolio UI - Storage Management Utilities
 *
 * Handles localStorage quota exceeded scenarios and storage optimization
 * Provides graceful degradation and cleanup strategies
 */

// Storage quota management
export interface StorageQuotaInfo {
  used: number;
  quota: number;
  available: number;
  usagePercentage: number;
  isQuotaExceeded: boolean;
  isNearLimit: boolean;
}

// Storage cleanup strategies
export type CleanupStrategy = 'aggressive' | 'conservative' | 'minimal';

// Storage entry metadata for management
export interface StorageEntry {
  key: string;
  size: number;
  timestamp: number;
  category: 'game-state' | 'achievements' | 'settings' | 'cache' | 'temp';
  priority: number; // Higher = less likely to be cleaned up
}

/**
 * Storage Manager with quota handling and cleanup
 */
export class StorageManager {
  private readonly QUOTA_WARNING_THRESHOLD = 0.8; // 80% usage triggers warning
  private readonly QUOTA_CRITICAL_THRESHOLD = 0.95; // 95% usage triggers aggressive cleanup

  /**
   * Get current localStorage usage information
   */
  getStorageInfo(): StorageQuotaInfo {
    try {
      let used = 0;
      const entries: StorageEntry[] = [];

      // Calculate total usage and catalog entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            const size = this.calculateSize(key, value);
            used += size;

            entries.push(this.createStorageEntry(key, value, size));
          }
        }
      }

      // Estimate quota (typical localStorage quota is 5-10MB)
      const quota = this.estimateQuota();
      const available = quota - used;
      const usagePercentage = used / quota;

      return {
        used,
        quota,
        available,
        usagePercentage,
        isQuotaExceeded: available <= 0,
        isNearLimit: usagePercentage >= this.QUOTA_WARNING_THRESHOLD,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return this.getDefaultStorageInfo();
    }
  }

  /**
   * Safely set item with quota handling
   */
  safeSetItem(
    key: string,
    value: string,
    category: StorageEntry['category'] = 'game-state'
  ): boolean {
    try {
      // Check if we have enough space
      const storageInfo = this.getStorageInfo();
      const itemSize = this.calculateSize(key, value);

      if (storageInfo.available < itemSize) {
        console.warn(`Storage quota insufficient for item "${key}". Attempting cleanup.`);

        // Try to make space
        const cleanupSuccess = this.performCleanup(itemSize);
        if (!cleanupSuccess) {
          console.error(`Failed to free sufficient space for item "${key}"`);
          return false;
        }
      }

      // Attempt to store the item
      localStorage.setItem(key, value);

      // Verify storage was successful
      const stored = localStorage.getItem(key);
      if (stored !== value) {
        console.error(`Storage verification failed for item "${key}"`);
        return false;
      }

      return true;
    } catch (error) {
      if (this.isQuotaExceededError(error)) {
        console.warn(`Quota exceeded while storing "${key}". Attempting emergency cleanup.`);

        // Emergency cleanup
        if (this.performEmergencyCleanup()) {
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (retryError) {
            console.error(`Failed to store "${key}" even after emergency cleanup:`, retryError);
          }
        }
      }

      console.error(`Failed to store item "${key}":`, error);
      return false;
    }
  }

  /**
   * Safely get item with error handling
   */
  safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to retrieve item "${key}":`, error);
      return null;
    }
  }

  /**
   * Safely remove item with error handling
   */
  safeRemoveItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item "${key}":`, error);
      return false;
    }
  }

  /**
   * Perform cleanup based on strategy and required space
   */
  performCleanup(requiredSpace: number, strategy: CleanupStrategy = 'conservative'): boolean {
    try {
      const entries = this.getStorageEntries();
      const sortedEntries = this.sortEntriesByPriority(entries, strategy);

      let freedSpace = 0;
      const itemsToRemove: string[] = [];

      for (const entry of sortedEntries) {
        if (freedSpace >= requiredSpace) break;

        // Skip high-priority entries unless aggressive cleanup
        if (strategy === 'minimal' && entry.priority >= 8) continue;
        if (strategy === 'conservative' && entry.priority >= 6) continue;

        itemsToRemove.push(entry.key);
        freedSpace += entry.size;
      }

      // Remove items in reverse order (lowest priority first)
      for (const key of itemsToRemove.reverse()) {
        this.safeRemoveItem(key);
      }

      console.log(`Cleanup freed ${freedSpace} bytes by removing ${itemsToRemove.length} items`);
      return freedSpace >= requiredSpace;
    } catch (error) {
      console.error('Cleanup failed:', error);
      return false;
    }
  }

  /**
   * Emergency cleanup for quota exceeded scenarios
   */
  performEmergencyCleanup(): boolean {
    try {
      console.warn('Performing emergency cleanup - removing non-critical data');

      const emergencyRemovals = [
        // Remove cache and temporary data first
        ...this.getKeysByPattern('cache-'),
        ...this.getKeysByPattern('temp-'),
        ...this.getKeysByPattern('_cache'),

        // Remove old game states (keep only the most recent)
        ...this.getOldGameStates(1), // Keep only 1 most recent

        // Remove achievement history (keep achievements themselves)
        ...this.getKeysByPattern('achievement-history'),
      ];

      let removedCount = 0;
      for (const key of emergencyRemovals) {
        if (this.safeRemoveItem(key)) {
          removedCount++;
        }
      }

      console.log(`Emergency cleanup removed ${removedCount} items`);

      // Check if we made enough space
      const storageInfo = this.getStorageInfo();
      return !storageInfo.isQuotaExceeded;
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
      return false;
    }
  }

  /**
   * Optimize storage by compressing and reorganizing data
   */
  optimizeStorage(): void {
    try {
      console.log('Starting storage optimization');

      // Compress game state if possible
      this.compressGameState();

      // Remove expired entries
      this.removeExpiredEntries();

      // Defragment storage (remove and re-add entries to reduce fragmentation)
      this.defragmentStorage();

      console.log('Storage optimization completed');
    } catch (error) {
      console.error('Storage optimization failed:', error);
    }
  }

  /**
   * Get storage quota warnings for user notification
   */
  getStorageWarnings(): {
    level: 'info' | 'warning' | 'critical';
    message: string;
    actions: string[];
  } | null {
    const info = this.getStorageInfo();

    if (info.isQuotaExceeded) {
      return {
        level: 'critical',
        message: 'Storage quota exceeded. Some data may not be saved properly.',
        actions: ['Clear browser cache', 'Remove unused data', 'Contact support if issue persists'],
      };
    }

    if (info.usagePercentage >= this.QUOTA_CRITICAL_THRESHOLD) {
      return {
        level: 'warning',
        message: 'Storage almost full. Performance may be affected.',
        actions: ['Clear temporary data', 'Optimize storage'],
      };
    }

    if (info.usagePercentage >= this.QUOTA_WARNING_THRESHOLD) {
      return {
        level: 'info',
        message: 'Storage usage is getting high.',
        actions: ['Consider cleaning up old data'],
      };
    }

    return null;
  }

  // Private helper methods

  private calculateSize(key: string, value: string): number {
    return (key.length + value.length) * 2; // UTF-16 characters are 2 bytes
  }

  private createStorageEntry(key: string, value: string, size: number): StorageEntry {
    const category = this.categorizeKey(key);
    const priority = this.calculatePriority(key, category);
    const timestamp = this.extractTimestamp(key) || Date.now();

    return { key, size, timestamp, category, priority };
  }

  private categorizeKey(key: string): StorageEntry['category'] {
    if (key.includes('game-state') || key.includes('gameboy-portfolio')) return 'game-state';
    if (key.includes('achievement')) return 'achievements';
    if (key.includes('settings')) return 'settings';
    if (key.includes('cache') || key.includes('temp'))
      return key.includes('temp') ? 'temp' : 'cache';
    return 'game-state'; // Default
  }

  private calculatePriority(key: string, category: StorageEntry['category']): number {
    const basePriorities = {
      'game-state': 10,
      achievements: 9,
      settings: 8,
      cache: 3,
      temp: 1,
    };

    let priority = basePriorities[category];

    // Boost priority for essential items
    if (key.includes('current') || key.includes('active')) priority += 2;
    if (key.includes('backup')) priority += 1;
    if (key.includes('auto-save')) priority += 1;

    return Math.min(10, priority);
  }

  private extractTimestamp(key: string): number | null {
    const timestampMatch = key.match(/(\d{13})/); // Unix timestamp
    return timestampMatch ? parseInt(timestampMatch[1]) : null;
  }

  private getStorageEntries(): StorageEntry[] {
    const entries: StorageEntry[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = this.calculateSize(key, value);
          entries.push(this.createStorageEntry(key, value, size));
        }
      }
    }

    return entries;
  }

  private sortEntriesByPriority(
    entries: StorageEntry[],
    strategy: CleanupStrategy
  ): StorageEntry[] {
    return entries.sort((a, b) => {
      // Sort by priority (lowest first), then by age (oldest first)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.timestamp - b.timestamp;
    });
  }

  private getKeysByPattern(pattern: string): string[] {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(pattern)) {
        keys.push(key);
      }
    }

    return keys;
  }

  private getOldGameStates(keepCount: number): string[] {
    const stateKeys = this.getKeysByPattern('game-state');
    const entries = stateKeys.map((key) => ({
      key,
      timestamp: this.extractTimestamp(key) || 0,
    }));

    // Sort by timestamp (newest first)
    entries.sort((a, b) => b.timestamp - a.timestamp);

    // Return all but the newest `keepCount` entries
    return entries.slice(keepCount).map((entry) => entry.key);
  }

  private compressGameState(): void {
    const gameStateKey = 'gameboy-portfolio:state';
    const gameState = this.safeGetItem(gameStateKey);

    if (gameState) {
      try {
        const parsed = JSON.parse(gameState);
        // Remove redundant data while preserving structure
        const compressed = this.removeRedundantData(parsed);
        this.safeSetItem(gameStateKey, JSON.stringify(compressed));
      } catch (error) {
        console.warn('Failed to compress game state:', error);
      }
    }
  }

  private removeRedundantData(data: any): any {
    if (typeof data !== 'object' || data === null) return data;

    const cleaned: any = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      // Skip undefined and null values
      if (value === undefined || value === null) continue;

      // Skip empty arrays and objects
      if (Array.isArray(value) && value.length === 0) continue;
      if (typeof value === 'object' && Object.keys(value).length === 0) continue;

      // Recursively clean nested objects
      cleaned[key] = this.removeRedundantData(value);
    }

    return cleaned;
  }

  private removeExpiredEntries(): void {
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const timestamp = this.extractTimestamp(key);
        if (timestamp && now - timestamp > maxAge) {
          this.safeRemoveItem(key);
        }
      }
    }
  }

  private defragmentStorage(): void {
    const entries: { key: string; value: string }[] = [];

    // Backup all entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          entries.push({ key, value });
        }
      }
    }

    // Clear and restore
    localStorage.clear();
    for (const { key, value } of entries) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn(`Failed to restore entry "${key}" during defragmentation:`, error);
      }
    }
  }

  private estimateQuota(): number {
    // Typical localStorage quota is 5-10MB, use 5MB as conservative estimate
    return 5 * 1024 * 1024; // 5MB in bytes
  }

  private getDefaultStorageInfo(): StorageQuotaInfo {
    const quota = this.estimateQuota();
    return {
      used: 0,
      quota,
      available: quota,
      usagePercentage: 0,
      isQuotaExceeded: false,
      isNearLimit: false,
    };
  }

  private isQuotaExceededError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_EXCEEDED_ERR' ||
        error.message.includes('quota') ||
        error.message.includes('storage') ||
        error.message.includes('exceeded')
      );
    }
    return false;
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

/**
 * Enhanced localStorage wrapper with quota handling
 */
export const safeLocalStorage = {
  setItem: (key: string, value: string, category?: StorageEntry['category']) =>
    storageManager.safeSetItem(key, value, category),

  getItem: (key: string) => storageManager.safeGetItem(key),

  removeItem: (key: string) => storageManager.safeRemoveItem(key),

  getStorageInfo: () => storageManager.getStorageInfo(),

  getWarnings: () => storageManager.getStorageWarnings(),

  optimize: () => storageManager.optimizeStorage(),

  cleanup: (requiredSpace: number, strategy?: CleanupStrategy) =>
    storageManager.performCleanup(requiredSpace, strategy),
};
