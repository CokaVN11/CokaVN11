'use client';

import { useState, useRef, useEffect, memo } from 'react';
import type { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PatternSeparator } from './ui/pattern-separator';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// ─── Types ───────────────────────────────────────────────────────────────────

type NavLink = { label: string; href: string };
type SocialLink = { label: string; href: string; icon: ReactNode };

type NavbarProps = {
  brand: string;
  subtitle?: string;
  navLinks: NavLink[];
  socialLinks?: SocialLink[];
  className?: string;
};

type BrandBlockProps = { brand: string; subtitle?: string };
type NavLinksProps = {
  links: NavLink[];
  linkClassName: string;
  onLinkClick?: (href: string) => void;
};
type SocialLinksProps = {
  links: SocialLink[];
  showLabel?: boolean;
  className?: string;
  onLinkClick?: () => void;
};

// ─── Module-level constants ───────────────────────────────────────────────────
// Vercel: rerender-memo-with-default-value — stable reference avoids re-renders
// Vercel: rendering-hoist-jsx — static JSX frozen outside render scope

const EMPTY_SOCIAL_LINKS: SocialLink[] = [];

const DRAWER_HANDLE = (
  <Drawer.Handle className="mx-auto mt-2 mb-0 h-1 w-8 rounded-full bg-border" />
);

const DRAWER_TITLE = (
  <VisuallyHidden>
    <Drawer.Title className="font-medium mb-4 text-gray-900">Navigation bar.</Drawer.Title>
  </VisuallyHidden>
);

// ─── Utilities ────────────────────────────────────────────────────────────────

function isExternalHref(href: string): boolean {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

// ─── File-local sub-components ───────────────────────────────────────────────

function BrandBlock({ brand, subtitle }: BrandBlockProps) {
  return (
    <div>
      <p className="font-mono-display text-sm tracking-wide text-foreground">{brand}</p>
      {subtitle ? (
        <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function NavLinks({ links, linkClassName, onLinkClick }: NavLinksProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!onLinkClick) return;
    if (href.startsWith('#')) e.preventDefault();
    onLinkClick(href);
  }

  return (
    <>
      {links.map((link) => {
        const external = isExternalHref(link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={linkClassName}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
}

function SocialLinks({ links, showLabel = false, className, onLinkClick }: SocialLinksProps) {
  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          onClick={onLinkClick}
          className="flex items-center gap-2 text-muted-foreground transition-colors duration-150 hover:text-primary"
        >
          {link.icon}
          {showLabel ? (
            <span className="font-mono-display text-xs uppercase tracking-widest">
              {link.label}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
// Vercel: rerender-memo — Navbar props are stable; memo prevents needless re-renders

export const Navbar = memo(function Navbar({
  brand,
  subtitle,
  navLinks,
  socialLinks = EMPTY_SOCIAL_LINKS,
  className,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pendingScrollId = useRef<string | null>(null);

  function handleNavClick(href: string) {
    if (href.startsWith('#')) {
      pendingScrollId.current = href.slice(1);
    }
    setOpen(false);
  }

  // useEffect fires when React sees open→false, including programmatic setOpen(false).
  // onAnimationEnd won't fire for programmatic closes in controlled mode (vaul only
  // calls its internal onChange when vaul itself initiates the close).
  useEffect(() => {
    if (open || !pendingScrollId.current) return;
    const id = pendingScrollId.current;
    pendingScrollId.current = null;
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      // window.scrollTo is more reliably honored on iOS Safari than scrollIntoView.
      // scroll-padding-top on <html> handles the fixed navbar offset.
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 500); // vaul TRANSITIONS.DURATION = 0.5s
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Drawer.Root
      direction="bottom"
      open={open}
      onOpenChange={setOpen}
      disablePreventScroll={false}
      noBodyStyles
      preventScrollRestoration
    >
      <nav className={cn('fixed bg-background top-0 w-full px-4 pt-6', className)}>
        {/* Mobile top bar */}
        <div className="flex items-center justify-between pb-4 md:hidden">
          <BrandBlock brand={brand} subtitle={subtitle} />
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
          <BrandBlock brand={brand} subtitle={subtitle} />

          <div className="flex items-center gap-8">
            <NavLinks
              links={navLinks}
              linkClassName="font-mono-display text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-150 hover:text-primary"
            />
          </div>

          <SocialLinks links={socialLinks} className="flex items-center justify-end gap-4" />
        </div>

        <PatternSeparator />
      </nav>

      <Drawer.Portal>
        <Drawer.Overlay className="inset-0 bg-background/60" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] px-6 pt-4 pb-8 mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none gap-4">
          {DRAWER_HANDLE}
          {DRAWER_TITLE}

          <nav className="flex flex-col gap-2">
            <NavLinks
              links={navLinks}
              linkClassName="font-mono-display text-sm uppercase tracking-widest text-muted-foreground transition-colors duration-150 hover:text-primary py-2"
              onLinkClick={handleNavClick}
            />
          </nav>

          {socialLinks.length > 0 ? (
            <SocialLinks
              links={socialLinks}
              showLabel
              className="flex items-center gap-6 border-t border-border pt-6"
              onLinkClick={() => setOpen(false)}
            />
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
});
