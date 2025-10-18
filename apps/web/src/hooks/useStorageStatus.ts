/**
 * GameBoy Portfolio UI - Storage Status Hook
 *
 * React hook for monitoring localStorage usage and quota status
 * Provides storage warnings and optimization suggestions
 */

import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorage, type StorageQuotaInfo } from '../lib/gameboy/storage-manager';

export interface StorageStatus extends StorageQuotaInfo {
  warnings: {
    level: 'info' | 'warning' | 'critical';
    message: string;
    actions: string[];
  } | null;
  isOptimizing: boolean;
  optimizeStorage: () => Promise<void>;
  clearCache: () => boolean;
}

/**
 * Hook for monitoring localStorage usage and quota status
 */
export function useStorageStatus(): StorageStatus {
  const [storageInfo, setStorageInfo] = useState<StorageQuotaInfo>(() =>
    safeLocalStorage.getStorageInfo()
  );
  const [warnings, setWarnings] = useState<StorageStatus['warnings']>(() =>
    safeLocalStorage.getWarnings()
  );
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Update storage info periodically
  const updateStorageInfo = useCallback(() => {
    const newInfo = safeLocalStorage.getStorageInfo();
    const newWarnings = safeLocalStorage.getWarnings();

    setStorageInfo(newInfo);
    setWarnings(newWarnings);
  }, []);

  // Optimize storage
  const optimizeStorage = useCallback(async () => {
    setIsOptimizing(true);
    try {
      // Run optimization in a setTimeout to avoid blocking UI
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          safeLocalStorage.optimize();
          resolve();
        }, 0);
      });

      updateStorageInfo();
    } catch (error) {
      console.error('Storage optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [updateStorageInfo]);

  // Clear cache data
  const clearCache = useCallback(() => {
    try {
      // Remove cache-related items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes('cache-') ||
            key.includes('temp-') ||
            key.includes('_cache') ||
            key.includes('asset-cache'))
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => safeLocalStorage.removeItem(key));
      updateStorageInfo();

      console.log(`Cleared ${keysToRemove.length} cache entries`);
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }, [updateStorageInfo]);

  // Set up periodic monitoring
  useEffect(() => {
    // Update storage info every 30 seconds
    const interval = setInterval(updateStorageInfo, 30000);

    // Listen for storage events (changes from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('gameboy-portfolio')) {
        updateStorageInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateStorageInfo]);

  return {
    ...storageInfo,
    warnings,
    isOptimizing,
    optimizeStorage,
    clearCache,
  };
}

/**
 * Hook for storage quota monitoring with user notifications
 */
export function useStorageNotifications() {
  const storageStatus = useStorageStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationShown, setNotificationShown] = useState<Set<string>>(new Set());

  // Show notification for critical storage issues
  useEffect(() => {
    if (storageStatus.warnings && storageStatus.warnings.level === 'critical') {
      const notificationKey = `storage-critical-${Date.now()}`;

      if (!notificationShown.has(notificationKey)) {
        setShowNotification(true);
        setNotificationShown((prev) => new Set(prev).add(notificationKey));
      }
    }
  }, [storageStatus.warnings, notificationShown]);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    shouldShowNotification: showNotification,
    storageStatus,
    dismissNotification,
  };
}
