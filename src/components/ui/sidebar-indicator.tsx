import { cn } from "@/lib/utils";
import { memo } from "react";

export type IndicatorState = "hidden" | "visible" | "blinking";

export const SidebarIndicator = memo(function SidebarIndicator({
  state,
}: {
  state: IndicatorState;
}) {
  return (
    <span
      className={cn(
        `color-accent} inline-block w-[1ch]`,
        [state === "blinking" && "cursor-blink"],
        [state === "hidden" && "invisible"],
      )}
    >
      ►
    </span>
  );
});
