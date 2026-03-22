import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
  action?: React.ReactNode; // Optional action element (e.g., button or link)
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  className,
  id,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 mb-10',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {label && (
        <p className="text-xs tracking-widest uppercase font-mono-display text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex items-baseline gap-10">
        <h2
          id={id}
          className="text-2xl leading-tight tracking-tight font-mono-display text-foreground sm:text-3xl"
        >
          {title}
        </h2>
        {description && (
          <p className="max-w-xl font-serif text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
