/**
 * GameBoy Portfolio UI - Storage Warning Component
 *
 * Displays localStorage quota warnings and provides optimization controls
 * Styled to match Pokemon FireRed/LeafGreen GameBoy aesthetic
 */

import React from 'react';
import { useTheme } from 'next-themes';
import { useStorageNotifications } from '../../hooks/useStorageStatus';
import { safeLocalStorage } from '../../lib/gameboy/storage-manager';

interface StorageWarningProps {
  className?: string;
  showOptimizationButton?: boolean;
  compact?: boolean;
}

/**
 * Storage warning component with Pokemon GameBoy styling
 */
export function StorageWarning({
  className = '',
  showOptimizationButton = true,
  compact = false,
}: StorageWarningProps) {
  const { theme } = useTheme();
  const { shouldShowNotification, storageStatus, dismissNotification } = useStorageNotifications();

  if (!shouldShowNotification || !storageStatus.warnings) {
    return null;
  }

  const { warnings } = storageStatus;
  const usagePercentage = Math.round(storageStatus.usagePercentage * 100);

  const handleOptimize = async () => {
    await storageStatus.optimizeStorage();
  };

  const handleClearCache = () => {
    storageStatus.clearCache();
  };

  const handleDismiss = () => {
    dismissNotification();
  };

  // Compact version for HUD or small spaces
  if (compact) {
    return (
      <div className={`fixed top-2 right-2 z-50 max-w-xs font-pixel ${className}`}>
        <div className="pokemon-card gba-shadow p-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">⚠️ Storage Full</span>
            <button
              onClick={handleDismiss}
              className="ml-2 hover:opacity-80 transition-opacity pokemon-button gba-shadow-sm px-1"
              aria-label="Dismiss storage warning"
            >
              ✕
            </button>
          </div>
          <div className="opacity-80 text-xs mt-1">{usagePercentage}% used</div>
        </div>
      </div>
    );
  }

  // Full warning panel
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${className}`}
    >
      <div className="pokemon-card gba-shadow-lg p-6 max-w-md w-full font-pixel">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {warnings.level === 'critical' ? '🚨' : warnings.level === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <h3 className="text-lg font-bold">
              Storage{' '}
              {warnings.level === 'critical'
                ? 'Critical'
                : warnings.level === 'warning'
                  ? 'Warning'
                  : 'Info'}
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="hover:opacity-80 transition-opacity text-xl pokemon-button gba-shadow-sm px-2 py-1"
            aria-label="Dismiss storage warning"
          >
            ✕
          </button>
        </div>

        {/* Warning message */}
        <p className="mb-4 opacity-90">{warnings.message}</p>

        {/* Storage usage visual */}
        <div className="mb-4">
          <div className="flex justify-between text-sm opacity-70 mb-1">
            <span>Storage Usage</span>
            <span>{usagePercentage}%</span>
          </div>
          <div className="w-full rounded-full h-3 border-2 gba-shadow-sm">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                storageStatus.isQuotaExceeded
                  ? 'bg-red-500'
                  : storageStatus.isNearLimit
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            />
          </div>
          <div className="text-xs opacity-60 mt-1">
            {(storageStatus.used / 1024).toFixed(1)}KB used of{' '}
            {(storageStatus.quota / 1024).toFixed(1)}KB
          </div>
        </div>

        {/* Recommended actions */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">Recommended Actions:</h4>
          <ul className="text-sm opacity-80 space-y-1">
            {warnings.actions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {showOptimizationButton && (
            <button
              onClick={handleOptimize}
              disabled={storageStatus.isOptimizing}
              className={`flex-1 pokemon-button gba-shadow px-4 py-2 text-white text-sm font-semibold transition-all ${
                storageStatus.isOptimizing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              }`}
            >
              {storageStatus.isOptimizing ? 'Optimizing...' : 'Optimize Storage'}
            </button>
          )}

          <button
            onClick={handleClearCache}
            className="flex-1 pokemon-button gba-shadow-sm px-4 py-2 text-white text-sm font-semibold hover:scale-105 transition-all"
          >
            Clear Cache
          </button>

          <button
            onClick={handleDismiss}
            className="flex-1 pokemon-button gba-shadow-sm px-4 py-2 text-sm font-semibold hover:scale-105 transition-all"
          >
            Dismiss
          </button>
        </div>

        {/* Additional info */}
        {warnings.level === 'critical' && (
          <div className="mt-4 p-2 rounded border-2 gba-shadow-sm opacity-90">
            <strong>Note:</strong> Some data may not be saved properly until storage space is freed.
          </div>
        )}

        {/* Theme indicator */}
        <div className="mt-4 text-center text-xs opacity-60">
          Theme: {theme === 'fire' ? '🔥 Fire Red' : '🍃 Leaf Green'}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact storage indicator for HUD with Pokemon styling
 */
export function StorageIndicator({ className = '' }: { className?: string }) {
  const { theme } = useTheme();
  const storageStatus = useStorageNotifications().storageStatus;

  if (!storageStatus.isNearLimit && !storageStatus.isQuotaExceeded) {
    return null;
  }

  const usagePercentage = Math.round(storageStatus.usagePercentage * 100);

  return (
    <div className={`flex items-center space-x-2 text-xs font-pixel ${className}`}>
      <span
        className={
          storageStatus.isQuotaExceeded
            ? 'text-red-500'
            : storageStatus.isNearLimit
              ? 'text-yellow-500'
              : 'text-green-500'
        }
      >
        {storageStatus.isQuotaExceeded ? '🚨' : '⚠️'}
      </span>
      <span className="opacity-80">Storage: {usagePercentage}%</span>
      <span className="opacity-60 text-xs">
        ({theme === 'fire' ? '🔥' : '🍃'})
      </span>
    </div>
  );
}