import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/button';
import { PatternSeparator } from '../ui/pattern-separator';
import { CompanionStrip } from '../ui/companion-strip';

type HeroProps = {
  name: string;
  tagline: string;
  systemIdentity: string[];
  actions: { label: string; href: string; variant?: 'default' | 'outline' | 'ghost' }[];
  className?: string;
};

export function Hero({ name, tagline, systemIdentity, actions, className }: HeroProps) {
  return (
    <section
      id="hero"
      className={cn(
        'w-[88vw] sm:w-[70vw] sm:max-w-225 container mx-auto flex flex-col justify-between min-h-[calc(100dvh-5rem)]',
        className
      )}
    >
      {/* Layer A: Ambient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_10%,oklch(0.573_0.223_267.8/0.25),transparent)]"
      />

      <div className="relative z-10 max-w-2xl">
        <p className="text-xs tracking-widest uppercase font-mono-display text-muted-foreground">
          Portfolio / Full-Stack Developer
        </p>

        <h1 className="mt-1 text-2xl leading-tight tracking-tight font-mono-display text-foreground sm:text-3xl lg:text-4xl">
          {name}
        </h1>

        <div className="w-12 h-px mt-4 bg-primary" />

        <p className="mt-3 font-serif text-base leading-relaxed text-foreground sm:text-lg">
          {tagline}
        </p>

        <ul className="mt-6 space-y-1.5" aria-label="Key focus areas">
          {systemIdentity.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 font-mono-display text-xs text-muted-foreground"
            >
              <span className="text-primary" aria-hidden="true">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant={action.variant ?? 'outline'}
              size="sm"
              className="text-xs tracking-widest uppercase font-mono-display"
            >
              <a href={action.href}>{action.label}</a>
            </Button>
          ))}
        </div>
      </div>

      <CompanionStrip />

      <PatternSeparator />
    </section>
  );
}
