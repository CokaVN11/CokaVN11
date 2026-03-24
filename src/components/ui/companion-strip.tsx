'use client';

import { useRef, useEffect } from 'react';

const FRAME_SIZE = 32; // neko.ts: NEKO_WIDTH / NEKO_HEIGHT
const SPRITE_GAP = 1; // neko.ts: SPRITE_GAP
const CHAR_DISPLAY = 56; // rendered px
const SCALE = CHAR_DISPLAY / FRAME_SIZE; // 1.75

const FRAME_RATE = 300;
const IDLE_THRESHOLD = 10;
const IDLE_ANIMATION_CHANCE = 1 / 15;
const ALERT_TIME = 2;
const LERP_FACTOR = 0.08;
const MOVE_THRESHOLD = 0.0005;

const spriteSets: Record<string, [number, number][]> = {
  idle: [[0, 0]],
  alert: [[7, 0]],
  lickPaw: [[1, 0]],
  scratchSelf: [
    [2, 0],
    [3, 0],
  ],
  scratchWallS: [
    [0, 3],
    [1, 3],
  ],
  scratchWallE: [
    [2, 3],
    [3, 3],
  ],
  scratchWallN: [
    [4, 3],
    [5, 3],
  ],
  scratchWallW: [
    [6, 3],
    [7, 3],
  ],
  tired: [[4, 0]],
  sleeping: [
    [5, 0],
    [6, 0],
  ],
  walk: [
    [5, 1],
    [6, 1],
  ],
};

type IdleAnim = 'scratchSelf' | 'lickPaw' | 'sleeping' | null;

type CompanionStripProps = {
  spriteSheetUrl?: string;
  bgColor?: [number, number, number] | null;
};

async function makeTransparent(
  url: string,
  targetColor: [number, number, number]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('no canvas context');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] === targetColor[0] && d[i + 1] === targetColor[1] && d[i + 2] === targetColor[2]) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
  });
}

export function CompanionStrip({
  spriteSheetUrl = '/blue.png',
  bgColor = [0, 174, 240],
}: CompanionStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteFlipRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  const posX = useRef(0.5);
  const targetX = useRef(0.5);
  const lastPos = useRef(0.5);
  const rafId = useRef<number>();

  const frameCount = useRef(0);
  const idleTime = useRef(0);
  const idleAnimation = useRef<IdleAnim>(null);
  const idleAnimFrame = useRef(0);
  const lastTickTs = useRef<number | null>(null);
  const alertTime = useRef(0);
  const wasMoving = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e: MouseEvent) => {
      targetX.current = e.clientX / window.innerWidth;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // setSprite: source-pixel exact backgroundPosition (mirrors neko.ts)
    const setSprite = (name: string, frame: number) => {
      const el = spriteRef.current;
      if (!el) return;
      const spriteSet = spriteSets[name];
      if (!spriteSet?.length) return;
      const sprite = spriteSet[frame % spriteSet.length];
      if (!sprite) return;
      const px = sprite[0] * (FRAME_SIZE + SPRITE_GAP);
      const py = sprite[1] * (FRAME_SIZE + SPRITE_GAP);
      el.style.backgroundPosition = `-${px}px -${py}px`;
    };

    const resetIdleAnimation = () => {
      idleAnimation.current = null;
      idleAnimFrame.current = 0;
    };

    const followIdleBehavior = () => {
      if (
        idleTime.current > IDLE_THRESHOLD &&
        idleAnimation.current === null &&
        Math.random() < IDLE_ANIMATION_CHANCE
      ) {
        const anims: IdleAnim[] = ['scratchSelf', 'lickPaw', 'sleeping'];
        idleAnimation.current = anims[Math.floor(Math.random() * anims.length)] ?? null;
        idleAnimFrame.current = 0;
      }

      switch (idleAnimation.current) {
        case 'scratchSelf':
          setSprite('scratchSelf', idleAnimFrame.current);
          idleAnimFrame.current += 1;
          if (idleAnimFrame.current > 9) resetIdleAnimation();
          break;
        case 'lickPaw':
          setSprite('lickPaw', idleAnimFrame.current);
          idleAnimFrame.current += 1;
          if (idleAnimFrame.current > 4) resetIdleAnimation();
          break;
        case 'sleeping':
          setSprite(
            idleAnimFrame.current < 8 ? 'tired' : 'sleeping',
            Math.floor(idleAnimFrame.current / 4)
          );
          idleAnimFrame.current += 1;
          if (idleAnimFrame.current > 60) resetIdleAnimation();
          break;
        default:
          setSprite('idle', 0);
      }
    };

    const updateState = () => {
      const delta = posX.current - lastPos.current;
      const moving = Math.abs(delta) > MOVE_THRESHOLD;
      const dir = delta >= 0 ? 1 : -1;

      if (spriteFlipRef.current) {
        spriteFlipRef.current.style.transform = `scaleX(${moving || wasMoving.current ? dir : 1})`;
      }
      lastPos.current = posX.current;

      if (moving) {
        if (!wasMoving.current) {
          idleAnimation.current = null;
          idleAnimFrame.current = 0;
          idleTime.current = 0;
          alertTime.current = ALERT_TIME;
        }
        wasMoving.current = true;

        if (alertTime.current > 0) {
          setSprite('alert', 0);
          alertTime.current -= 1;
        } else {
          setSprite('walk', frameCount.current);
        }
      } else {
        wasMoving.current = false;
        idleTime.current += 1;
        followIdleBehavior();
      }
    };

    const tick = (timestamp: number) => {
      posX.current += (targetX.current - posX.current) * LERP_FACTOR;
      const stripWidth = stripRef.current?.offsetWidth ?? window.innerWidth;
      const maxX = Math.max(0, stripWidth - CHAR_DISPLAY);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${posX.current * maxX}px)`;
      }

      if (!reducedMotion) {
        if (lastTickTs.current === null) lastTickTs.current = timestamp;
        if (timestamp - lastTickTs.current >= FRAME_RATE) {
          lastTickTs.current = timestamp;
          frameCount.current += 1;
          updateState();
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    // Process transparency then start loop
    (async () => {
      if (bgColor && spriteRef.current) {
        try {
          const transparentUrl = await makeTransparent(spriteSheetUrl, bgColor);
          if (spriteRef.current) {
            spriteRef.current.style.backgroundImage = `url(${transparentUrl})`;
          }
        } catch {
          // Fallback: use original url (may show background color)
        }
      }
      setSprite('idle', 0);
      rafId.current = requestAnimationFrame(tick);
    })();

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [spriteSheetUrl, bgColor]);

  return (
    <div
      ref={stripRef}
      className="relative w-full h-20 md:block overflow-hidden"
      aria-hidden="true"
    >
      {/* Road surface */}
      <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-border bg-muted/20" />
      {/* Center dashes */}
      <div className="absolute bottom-3 left-0 right-0 border-t border-dashed border-border/30" />
      {/* Character container — translateX lerp target */}
      <div
        ref={containerRef}
        className="absolute bottom-7"
        style={{ willChange: 'transform', width: CHAR_DISPLAY, height: CHAR_DISPLAY }}
      >
        {/* Flip wrapper — scaleX direction */}
        <div
          ref={spriteFlipRef}
          style={{ width: CHAR_DISPLAY, height: CHAR_DISPLAY, overflow: 'hidden' }}
        >
          {/* Sprite at native 32×32, scaled up via CSS transform */}
          <div
            ref={spriteRef}
            style={{
              width: FRAME_SIZE,
              height: FRAME_SIZE,
              backgroundImage: `url(${spriteSheetUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0px 0px',
              imageRendering: 'pixelated',
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    </div>
  );
}
