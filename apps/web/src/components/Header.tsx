'use client';

import Link from 'next/link';
import { MobileNavigation } from './MobileNavigation';
import { ThemeToggle } from './theme-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/8bit/navigation-menu';
import { Button } from './ui/8bit/button';

interface HeaderProps {
  currentView: 'classic' | 'gameboy';
  setCurrentView: (view: 'classic' | 'gameboy') => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export function Header({
  currentView,
  setCurrentView,
  isSettingsOpen,
  setIsSettingsOpen,
}: HeaderProps) {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/project', label: 'Projects' },
    { href: '/job', label: 'Career' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <nav className="gba-shadow border-b-2" style={{ borderColor: 'var(--color-ink)' }}>
      <div className="mx-auto px-4 py-4 container">
        <div className="flex justify-between items-center">
          <h1
            className="font-pixel font-bold text-[var(--color-ink)] text-2xl uppercase tracking-wider"
            style={{
              textShadow: '2px 2px 0px color-mix(in srgb, var(--color-ink) 20%, transparent)',
            }}
          >
            Portfolio
          </h1>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation Links */}
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Button>
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* View Toggle Button - Enhanced with Pokemon styling */}
            <Button
              onClick={() => setCurrentView(currentView === 'classic' ? 'gameboy' : 'classic')}
              className="px-3 py-1 font-body text-sm hover:scale-105 transition-transform pokemon-button"
              aria-label={`Switch to ${currentView === 'classic' ? 'GameBoy' : 'Classic'} view`}
            >
              {currentView === 'classic' ? '🎮 GameBoy' : '📄 Classic'}
            </Button>

            {/* Mobile Navigation */}
            <MobileNavigation />

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1 font-body text-sm hover:scale-105 transition-transform pokemon-button"
              aria-label="Open settings panel"
            >
              ⚙️ Settings
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
