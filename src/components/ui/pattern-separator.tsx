import { cn } from '@/lib/utils';

interface PatternSeparatorProps {
  label?: string;
  char?: string;
  height?: number;
  tileSize?: number;
  className?: string;
}

export function PatternSeparator({
  label,
  char = '░',
  height = 14,
  tileSize = 14,
  className,
}: PatternSeparatorProps) {
  const patternId = `pattern-sep-${char.codePointAt(0)}`;

  return (
    <div className={cn('relative w-full text-black/50', className)} style={{ height }}>
      <svg width="100%" height={height} className="text-muted-foreground/40">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={tileSize}
            height={tileSize}
            patternUnits="userSpaceOnUse"
          >
            <text
              x="0"
              y={tileSize - 2}
              fill="currentColor"
              fontSize={tileSize}
              fontFamily="monospace"
            >
              {char}
            </text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {label && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="px-3 font-mono text-xs tracking-widest uppercase bg-background text-muted-foreground">
            {label}
          </span>
        </span>
      )}
    </div>
  );
}
