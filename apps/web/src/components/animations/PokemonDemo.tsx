'use client';

import React, { useState } from 'react';
import { PokemonPanel, PokemonNav, PokemonMenuItem } from './PokemonPanel';
import {
  PokemonWipeTransition,
  PokemonScreenWipe,
  PokemonPageTransition,
} from './PokemonWipeTransition';
import {
  PokemonButton,
  PokemonCard,
  PokemonText,
  PokemonList,
  PokemonNotification,
  PokemonProgressBar,
  PokemonFab,
} from './PokemonInteractive';
import {
  PokemonThemeProvider,
  usePokemonTheme,
  PokemonThemeToggle,
  PokemonThemeTransition,
  PokemonReducedMotionToggle,
  PokemonBackground,
} from './PokemonThemeToggle';
import {
  AccessibleMotion,
  AccessiblePokemonButton,
  AccessiblePokemonPanel,
  AccessibleProgress,
  SkipLink,
  useAccessibilityPreferences,
} from './PokemonAccessibility';
import {
  OptimizedMotion,
  SSGLazyMotion,
  BatchedAnimations,
  usePerformanceMonitor,
  AnimationUtils,
} from './PokemonMotionOptimized';

// Demo content component
const DemoContent: React.FC = () => {
  const { theme, reducedMotion } = usePokemonTheme();
  const { fps, isLowPerformance } = usePerformanceMonitor();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [progress, setProgress] = useState(0);
  const [isWiping, setIsWiping] = useState(false);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleScreenWipe = () => {
    setIsWiping(true);
    setTimeout(() => {
      setIsWiping(false);
      setCurrentView((prev) => (prev === 'home' ? 'battle' : 'home'));
    }, 500);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      onClick: () => setCurrentView('home'),
    },
    {
      id: 'about',
      label: 'About',
      onClick: () => setCurrentView('about'),
    },
    {
      id: 'projects',
      label: 'Projects',
      onClick: () => setCurrentView('projects'),
    },
    {
      id: 'contact',
      label: 'Contact',
      onClick: () => setCurrentView('contact'),
    },
  ];

  const listItems = [
    {
      id: '1',
      content: 'Pokemon-style animation #1',
      onClick: () => showNotification('Item 1 clicked!'),
    },
    {
      id: '2',
      content: 'Pokemon-style animation #2',
      onClick: () => showNotification('Item 2 clicked!'),
    },
    {
      id: '3',
      content: 'Pokemon-style animation #3',
      onClick: () => showNotification('Item 3 clicked!'),
    },
  ];

  return (
    <PokemonBackground pattern="dots">
      <div className="min-h-screen p-8">
        {/* Skip to content link */}
        <SkipLink href="#main-content">Skip to main content</SkipLink>

        {/* Performance monitor */}
        <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-40">
          <div>FPS: {fps}</div>
          <div>Performance: {isLowPerformance ? 'LOW' : 'GOOD'}</div>
          <div>Device Tier: {AnimationUtils.getPerformanceTier()}</div>
          <div>Motion: {reducedMotion ? 'REDUCED' : 'FULL'}</div>
          <div>Theme: {theme}</div>
        </div>

        {/* Theme and accessibility controls */}
        <div className="fixed top-4 right-4 flex flex-col space-y-2 z-40">
          <PokemonThemeToggle showLabel />
          <PokemonReducedMotionToggle showLabel />
        </div>

        {/* Floating action button */}
        <PokemonFab position="bottom-right" onClick={() => setIsPanelOpen(true)}>
          <span className="text-2xl">☰</span>
        </PokemonFab>

        {/* Main content */}
        <main id="main-content" className="max-w-6xl mx-auto">
          <PokemonPageTransition>
            <div className="text-center mb-12">
              <PokemonText delay={0}>
                <h1
                  className="text-6xl font-bold mb-4"
                  style={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Pokemon UI Animations
                </h1>
              </PokemonText>
              <PokemonText delay={200}>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  GBA-style transitions with modern web accessibility
                </p>
              </PokemonText>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <PokemonButton variant="primary" onClick={() => setIsPanelOpen(true)}>
                Open Panel
              </PokemonButton>
              <PokemonButton variant="secondary" onClick={handleScreenWipe}>
                Screen Wipe
              </PokemonButton>
              <PokemonButton
                variant="success"
                onClick={() => setProgress(Math.min(progress + 20, 100))}
              >
                Increase Progress
              </PokemonButton>
              <PokemonButton variant="danger" onClick={() => setProgress(0)}>
                Reset Progress
              </PokemonButton>
            </div>

            {/* Progress bar */}
            <div className="max-w-md mx-auto mb-12">
              <PokemonProgressBar value={progress} max={100} showLabel />
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {listItems.map((item, index) => (
                <OptimizedMotion
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 100,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  lazy={true}
                >
                  <PokemonCard onClick={item.onClick}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎮</div>
                      <h3 className="font-bold text-lg mb-2">{item.content}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Click me for Pokemon-style interaction!
                      </p>
                    </div>
                  </PokemonCard>
                </OptimizedMotion>
              ))}
            </div>

            {/* Animated list */}
            <div className="max-w-md mx-auto mb-12">
              <h2 className="text-2xl font-bold mb-4 text-center">Animated Menu List</h2>
              <PokemonList items={listItems} />
            </div>

            {/* Accessibility demo */}
            <div className="max-w-md mx-auto mb-12">
              <h2 className="text-2xl font-bold mb-4 text-center">Accessibility Features</h2>
              <div className="space-y-4">
                <AccessiblePokemonButton
                  ariaLabel="Accessible button with screen reader support"
                  onClick={() => showNotification('Accessible button clicked!')}
                >
                  Accessible Button
                </AccessiblePokemonButton>
                <AccessibleProgress
                  value={progress}
                  max={100}
                  label="Screen reader friendly progress"
                  showPercentage
                />
              </div>
            </div>
          </PokemonPageTransition>
        </main>

        {/* Navigation panel */}
        <PokemonPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} position="left">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Navigation</h3>
              <PokemonNav items={navItems} selectedId={currentView} />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Settings</h3>
              <div className="space-y-2">
                <PokemonMenuItem
                  isSelected={false}
                  onClick={() => showNotification('Settings clicked!')}
                >
                  ⚙️ Settings
                </PokemonMenuItem>
                <PokemonMenuItem
                  isSelected={false}
                  onClick={() => showNotification('Profile clicked!')}
                >
                  👤 Profile
                </PokemonMenuItem>
                <PokemonMenuItem
                  isSelected={false}
                  onClick={() => showNotification('Help clicked!')}
                >
                  ❓ Help
                </PokemonMenuItem>
              </div>
            </div>
          </div>
        </PokemonPanel>

        {/* Notification */}
        <PokemonNotification
          isVisible={notification.show}
          type="info"
          onClose={() => setNotification({ show: false, message: '' })}
        >
          {notification.message}
        </PokemonNotification>

        {/* Screen wipe transition */}
        <PokemonScreenWipe
          isComplete={isWiping}
          onWipeComplete={() => {}}
          color={theme === 'dark' ? '#1a1a1a' : '#ffffff'}
          direction="right"
        >
          {/* Screen wipe content */}
        </PokemonScreenWipe>
      </div>
    </PokemonBackground>
  );
};

// Main demo component with providers
export const PokemonDemo: React.FC = () => {
  return (
    <PokemonThemeProvider>
      <PokemonThemeTransition>
        <DemoContent />
      </PokemonThemeTransition>
    </PokemonThemeProvider>
  );
};

export default PokemonDemo;