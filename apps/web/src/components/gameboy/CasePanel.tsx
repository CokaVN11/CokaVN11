'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MapNode, ContentFrontmatter } from '@/types/gameboy';

interface CasePanelProps {
  isOpen: boolean;
  node: MapNode | null;
  content: ContentFrontmatter | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export function CasePanel({
  isOpen,
  node,
  content,
  onClose,
  onPrevious,
  onNext,
  className = '',
}: CasePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside to close
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!node || !content) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className={`relative w-full max-w-2xl max-h-[80vh] bg-white border-4 rounded-lg shadow-2xl overflow-hidden ${className} pokemon-card gba-shadow-lg font-pixel`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            aria-describedby="panel-description"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b-4 gba-shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl gba-shadow-sm"
                >
                  {content.mapNode?.icon || '📦'}
                </div>
                <div>
                  <h2
                    id="panel-title"
                    className="text-xl font-bold"
                  >
                    {content.mapNode?.title || node.title}
                  </h2>
                  <p className="text-sm opacity-80">
                    {content.mapNode?.description || node.description}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:opacity-80 pokemon-button gba-shadow-sm"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]" id="panel-description">
              {/* Project/Experience Metadata */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {node.type.toUpperCase()}
                  </span>
                  {content.gameData && (
                    <>
                      <span
                        className="px-3 py-1 rounded-full text-xs"
                      >
                        {content.gameData.difficulty}
                      </span>
                      <span className="text-sm opacity-70">
                        ~{content.gameData.estimatedTime} min read
                      </span>
                    </>
                  )}
                </div>

                {content.date && (
                  <p className="text-sm opacity-70">
                    Published: {new Date(content.date).toLocaleDateString()}
                  </p>
                )}

                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded pokemon-card gba-shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed">{content.description}</p>
              </div>

              {/* Achievements */}
              {content.gameData?.achievements && content.gameData.achievements.length > 0 && (
                <div
                  className="mt-6 p-4 rounded-lg border-2 pokemon-card gba-shadow-sm"
                >
                  <h3 className="font-bold mb-2">
                    🏆 Possible Achievements
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {content.gameData.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>✨</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer with Navigation */}
            <div
              className="flex items-center justify-between p-4 border-t-4 gba-shadow-sm"
            >
              <div className="flex space-x-2">
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    className="p-2 rounded-lg transition-colors hover:opacity-80 pokemon-button gba-shadow-sm"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="p-2 rounded-lg transition-colors hover:opacity-80 pokemon-button gba-shadow-sm"
                    aria-label="Next project"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>

              <div className="text-sm opacity-70">Press ESC to close</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CasePanel;