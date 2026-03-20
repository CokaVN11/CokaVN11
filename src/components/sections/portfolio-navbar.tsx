import { cn } from '@/lib/utils';
import { PatternSeparator } from '../ui/pattern-separator';

type PortfolioNavbarProps = {
  links: { label: string; href: string }[];
  brand: string;
  subtitle?: string;
  resumeHref?: string;
  className?: string;
};

export function PortfolioNavbar({
  links,
  brand,
  subtitle,
  resumeHref,
  className,
}: PortfolioNavbarProps) {
  return (
    <nav className={cn(className)}>
      <div className="flex items-center justify-between w-full pb-10">
        <div>
          <h1 className="text-2xl tracking-wide font-mono-display text-foreground">{brand}</h1>
          {subtitle && <p className="text-xs text-primary">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide transition-colors font-mono-display text-foreground hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          {resumeHref && (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-wide transition-colors font-mono-display text-foreground hover:text-primary"
            >
              Resume
            </a>
          )}
        </div>
      </div>
      <PatternSeparator />
    </nav>
  );
}

export default PortfolioNavbar;
