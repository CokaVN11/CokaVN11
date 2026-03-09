import { memo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { DotDivider } from "@/components/ui/dot-divider";

interface InsertCoinProps {
  onInsert?: () => void;
  className?: string;
}

export const InsertCoin = memo(function InsertCoin({
  onInsert,
  className,
}: InsertCoinProps) {
  // stable ref so the effect never re-registers on prop change
  const onInsertRef = useRef(onInsert);
  useEffect(() => {
    onInsertRef.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    const handleKeyDown = () => onInsertRef.current?.();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn("arcade-stack cursor-pointer", className)}
      onClick={() => onInsertRef.current?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onInsertRef.current?.()}
      aria-label="Insert coin to start"
    >
      <DotDivider />
      <h2 className="text-name score-glow-pulse insert-coin-blink uppercase">
        ► INSERT COIN ◄
      </h2>
      <DotDivider />
    </div>
  );
});
