import { memo } from "react";
import { repeat } from "@/lib/utils";

interface DotDividerProps {
  count?: number;
}

export const DotDivider = memo(function DotDivider({ count = 15 }: DotDividerProps) {
  return (
    <div className="dot-divider">
      {repeat(count, (i) => (
        <span key={`dot-${i}`} style={{ animationDelay: `${i * 0.045}s` }}>
          ·
        </span>
      ))}
    </div>
  );
});
