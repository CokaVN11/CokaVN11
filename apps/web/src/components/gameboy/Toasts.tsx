'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import type { Achievement } from '@/types/gameboy';

interface ToastProps {
  achievement: Achievement;
  onClose: () => void;
  index: number;
}

function Toast({ achievement, onClose, index }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Get rarity color
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            },
          }}
          exit={{
            opacity: 0,
            x: 300,
            scale: 0.8,
            transition: { duration: 0.3 },
          }}
          style={{
            bottom: `${100 + index * 80}px`,
            position: 'fixed',
            right: '20px',
            zIndex: 50,
          }}
          className="w-80 max-w-sm"
        >
          <div
            className={`${getRarityColor(achievement.rarity)} rounded-lg shadow-lg border-2 border-white/20 backdrop-blur-sm p-4 relative`}
          >
            {/* Close button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>

            {/* Achievement content */}
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 text-3xl">{achievement.icon}</div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    Achievement Unlocked!
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/20`}>
                    {achievement.rarity}
                  </span>
                </div>

                <h4 className="font-bold text-sm mb-1">{achievement.name}</h4>

                <p className="text-xs opacity-90 leading-relaxed">{achievement.description}</p>

                {/* Achievement progress (if applicable) */}
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white/80 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sparkle effects for legendary achievements */}
            {achievement.rarity === 'legendary' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: '50%',
                      y: '50%',
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: ['50%', `${50 + (Math.random() - 0.5) * 100}%`, '50%'],
                      y: ['50%', `${50 + (Math.random() - 0.5) * 100}%`, '50%'],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ToastsProps {
  className?: string;
}

export function Toasts({ className = '' }: ToastsProps) {
  const [toasts, setToasts] = useState<Achievement[]>([]);
  const gameState = useGameState();

  // Listen for new achievements
  useEffect(() => {
    const currentAchievements = gameState.progress.achievements;
    const lastUnlocked = currentAchievements.filter((a) => a.unlockedAt);

    // Check for newly unlocked achievements (unlocked in the last second)
    const now = Date.now();
    const newAchievements = lastUnlocked.filter(
      (a) => a.unlockedAt && typeof a.unlockedAt === 'number' && now - a.unlockedAt < 1000
    );

    if (newAchievements.length > 0) {
      // Add new achievements to toasts (avoid duplicates)
      setToasts((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const uniqueNew = newAchievements.filter((a) => !existingIds.has(a.id));
        return [...prev, ...uniqueNew].slice(-5); // Keep max 5 toasts
      });
    }
  }, [gameState.progress.achievements]);

  // Remove toast
  const removeToast = (achievementId: string) => {
    setToasts((prev) => prev.filter((a) => a.id !== achievementId));
  };

  // Clear all toasts
  const clearAllToasts = () => {
    setToasts([]);
  };

  // Auto-clear very old toasts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) =>
        prev.filter((toast) => {
          const unlockedAt = toast.unlockedAt;
          return !unlockedAt || (typeof unlockedAt === 'number' && now - unlockedAt < 30000); // Keep for 30 seconds max
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      <div className="relative h-full w-full">
        {toasts.map((achievement, index) => (
          <Toast
            key={achievement.id}
            achievement={achievement}
            onClose={() => removeToast(achievement.id)}
            index={index}
          />
        ))}
      </div>

      {/* Clear all button when multiple toasts */}
      {toasts.length > 1 && (
        <button
          onClick={clearAllToasts}
          className="pointer-events-auto fixed top-4 right-4 px-3 py-2 bg-black/80 text-white text-xs rounded-lg border border-white/20 hover:bg-black/90 transition-colors"
          aria-label="Clear all notifications"
        >
          Clear All ({toasts.length})
        </button>
      )}
    </div>
  );
}

export default Toasts;
