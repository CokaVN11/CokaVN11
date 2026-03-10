import { useState } from "react";
import { Image } from "@unpic/react";
function CornerAccent({ direction }: { direction: "tl" | "tr" | "bl" | "br" }) {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: -1, left: -1 },
    tr: { top: -1, right: -1 },
    bl: { bottom: -1, left: -1 },
    br: { bottom: -1, right: -1 },
  };

  return (
    <span
      className="absolute font-mono color-border leading-1 text-xs md:text-sm lg:text-base"
      style={styles[direction]}
    >
      {direction === "tl"
        ? "┌"
        : direction === "tr"
          ? "┐"
          : direction === "bl"
            ? "└"
            : "┘"}
    </span>
  );
}

function AvatarCornerAccents() {
  return (
    <>
      <CornerAccent direction="tl" />
      <CornerAccent direction="tr" />
      <CornerAccent direction="bl" />
      <CornerAccent direction="br" />
    </>
  );
}

interface AvatarProps {
  src?: string;
}

export function Avatar({ src }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center size-20 md:size-24 lg:size-28 border border-solid overflow-hidden">
      <AvatarCornerAccents />

      {!imgError ? (
        <Image
          src={src ?? "/assets/avatar.png"}
          layout="fullWidth"
          alt={`Avatar ${src}`}
          onError={() => setImgError(true)}
          className="object-cover"
        />
      ) : (
        <span className="text-heading color-accent text-flicker">◈</span>
      )}
    </div>
  );
}
