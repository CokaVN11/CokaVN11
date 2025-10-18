'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PokemonPanel } from './pokemon-panel';
import { PokemonHeading, PokemonText } from './text';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/project', label: 'Projects' },
    { href: '/job', label: 'Career' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="relative flex flex-col justify-center items-center w-8 h-8 md:hidden pokemon-button px-2 py-1"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-2'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ease-in-out my-1 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-2'
          }`}
        />
      </button>

      {/* Pokemon Mobile Menu Panel */}
      <PokemonPanel isOpen={isOpen} onClose={closeMenu} title="Navigation">
        {/* Navigation Links */}
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block w-full pokemon-button px-4 py-3 text-lg font-body hover:scale-105 transition-transform text-center"
            >
              <span className="font-pixel uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Menu Footer */}
        <div className="pt-4 border-t-2" style={{ borderColor: 'var(--color-ink)' }}>
          <div className="text-center">
            <PokemonText className="text-sm">Khanh Nguyen Portfolio</PokemonText>
            <PokemonText className="text-xs">© 2025 All rights reserved</PokemonText>
          </div>
        </div>

        {/* Pokemon Theme Info */}
        <div className="pt-4">
          <PokemonHeading className="text-lg mb-2">Pokemon Theme</PokemonHeading>
          <PokemonText className="text-sm leading-relaxed">
            Experience the Game Boy Advance aesthetic with FireRed and LeafGreen themes!
          </PokemonText>
        </div>
      </PokemonPanel>
    </>
  );
}
