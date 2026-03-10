import { memo, useCallback, useState } from "react";
import { Image } from "@unpic/react";

const CHAR_MAP = {
  tl: "┌",
  tr: "┐",
  bl: "└",
  br: "┘",
} as const;

const CORNER_STYLES = {
  tl: { top: -1, left: -1 },
  tr: { top: -1, right: -1 },
  bl: { bottom: -1, left: -1 },
  br: { bottom: -1, right: -1 },
} as const;

type Direction = "tl" | "tr" | "bl" | "br";

const CornerAccent = memo(function CornerAccent({
  direction,
}: {
  direction: Direction;
}) {
  return (
    <span
      className="absolute font-mono color-border leading-1 text-xs md:text-sm lg:text-base"
      style={CORNER_STYLES[direction]}
    >
      {CHAR_MAP[direction]}
    </span>
  );
});

const CORNER_ACCENTS = (
  <>
    <CornerAccent direction="tl" />
    <CornerAccent direction="tr" />
    <CornerAccent direction="bl" />
    <CornerAccent direction="br" />
  </>
);

const DEFAULT_AVATAR_SRC = "/avatar.png";

interface AvatarProps {
  src?: string;
}

export function Avatar({ src }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const handleError = useCallback(() => setImgError(true), []);

  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center size-20 md:size-24 lg:size-28 border border-solid overflow-hidden">
      {CORNER_ACCENTS}

      {imgError ? (
        <span className="text-heading color-accent text-flicker">◈</span>
      ) : (
        <Image
          src={src ?? DEFAULT_AVATAR_SRC}
          layout="fullWidth"
          alt={`Avatar ${src}`}
          onError={handleError}
          className="object-cover"
        />
      )}
    </div>
  );
}
