import { memo } from "react";
import { cn, repeat } from "@/lib/utils";

interface HeroTitleProps {
  title: string;
  starDensity?: number;
  className?: string;
}

const TwinkleStar = memo(function TwinkleStar({ animationDelay }: { animationDelay: string }) {
  return (
    <span className="star-twinkle align-middle text-hero text-accent" style={{ animationDelay }}>
      ★
    </span>
  );
});

const TwinkleStarsList = memo(function TwinkleStarsList({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 leading-none", className)}>
      {repeat(count, (i) => {
        const animationDelay = `${(i + 3) * 0.2}s`;
        return <TwinkleStar key={animationDelay} animationDelay={animationDelay} />;
      })}
    </div>
  );
});

export function HeroTitle({ title, starDensity = 3, className = "" }: HeroTitleProps) {
  return (
    <div className={cn("arcade-stack", className)}>
      <TwinkleStarsList count={starDensity} />
      <span className="text-flicker text-center align-middle text-hero color-accent uppercase">
        {title}
      </span>
      <TwinkleStarsList count={starDensity} className="-mt-4!" />
    </div>
  );
}
