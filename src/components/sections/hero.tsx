import { cn } from '@/lib/utils/cn';
import { Button } from '../ui/button';
import { PatternSeparator } from '../ui/pattern-separator';

type HeroProps = {
  name: string;
  tagline: string;
  actions: { label: string; href: string; variant?: 'default' | 'outline' | 'ghost' }[];
  className?: string;
};

export function Hero({ name, tagline, actions, className }: HeroProps) {
  return (
    <section
      id="hero"
      className={cn(
        'w-full mx-auto flex flex-col justify-between min-h-[calc(100dvh-5rem)] snap-start',
        className
      )}
    >
      <div className="max-w-2xl">
        <div>
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
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 pb-10">
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
      <PatternSeparator />
    </section>
  );
}
