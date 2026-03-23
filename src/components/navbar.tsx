'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PatternSeparator } from './ui/pattern-separator';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type NavLink = { label: string; href: string };
type SocialLink = { label: string; href: string; icon: ReactNode };

type NavbarProps = {
  brand: string;
  subtitle?: string;
  navLinks: NavLink[];
  socialLinks?: SocialLink[];
  className?: string;
};

export function Navbar({ brand, subtitle, navLinks, socialLinks = [], className }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root direction="bottom" open={open} onOpenChange={setOpen} noBodyStyles>
      <nav className={cn(className)}>
        {/* Mobile top bar */}
        <div className="flex items-center justify-between pb-4 md:hidden">
          <div>
            <p className="font-mono-display text-sm tracking-wide text-foreground">{brand}</p>
            {subtitle && (
              <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          <Drawer.Trigger asChild>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </Drawer.Trigger>
        </div>

        {/* Desktop 3-column layout */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center pb-10 sm:w-[70vw] sm:max-w-225">
          {/* Left: brand */}
          <div>
            <p className="font-mono-display text-sm tracking-wide text-foreground">{brand}</p>
            {subtitle && (
              <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* Center: nav links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono-display text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: social icons */}
          <div className="flex items-center justify-end gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <PatternSeparator />
      </nav>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/60" />
        {/* <Drawer.Content className="z-50 bg-background border-b border-border px-6 pt-4 pb-8 flex flex-col gap-8 outline-none"> */}
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] px-6 pt-4 pb-8 mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none gap-4">
          <Drawer.Handle className="mx-auto mt-2 mb-0 h-1 w-8 rounded-full bg-border" />
          <VisuallyHidden>
            <Drawer.Title className="font-medium mb-4 text-gray-900">Navigation bar.</Drawer.Title>
          </VisuallyHidden>
          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono-display text-sm uppercase tracking-widest text-muted-foreground transition-colors duration-150 hover:text-primary py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6 border-t border-border pt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 font-mono-display text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
