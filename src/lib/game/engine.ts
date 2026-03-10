import type { Ball, Brick, GamePhysics, GameStatus, Paddle, ScoreFloat } from "./types";
import { useGameStore } from "@/stores/gameStore";

// ── Constants (task 9.1) ──────────────────────────────────────────────────────

export const COLS = 10;
export const BRICK_HEIGHT = 20;
export const BRICK_GAP_X = 8;
export const BRICK_GAP_Y = 6;
export const BRICK_TOP_PAD = 24;
export const CANVAS_PAD_X = 16;
export const BALL_SIZE = 6;
export const PADDLE_WIDTH = 80;
export const PADDLE_HEIGHT = 8;
export const PADDLE_BOTTOM = 30;
export const BASE_SPEED = 4;

// ── Brick row definitions (task 9.2) ─────────────────────────────────────────

const BRICK_ROW_DEFS = [
  { cssVar: "--brick-1", points: 100, section: "OVERVIEW" },
  { cssVar: "--brick-2", points: 200, section: "EXPERIENCE" },
  { cssVar: "--brick-3", points: 300, section: "STACK" },
  { cssVar: "--brick-4", points: 500, section: "PROJECTS" },
  { cssVar: "--brick-5", points: 800, section: "EDUCATION" },
] as const;

// ── Brick layout (task 9.3 & 9.4) ────────────────────────────────────────────

export function brickRect(col: number, row: number, canvasW: number) {
  const brickW = (canvasW - CANVAS_PAD_X * 2 - (COLS - 1) * BRICK_GAP_X) / COLS;
  const x = CANVAS_PAD_X + col * (brickW + BRICK_GAP_X);
  const y = BRICK_TOP_PAD + row * (BRICK_HEIGHT + BRICK_GAP_Y);
  return { x, y, w: brickW, h: BRICK_HEIGHT };
}

export function buildBricks(stage: number): Brick[][] {
  const rows = Math.min(3 + Math.max(0, stage - 1), 5);
  return Array.from({ length: rows }, (_, rowIndex) => {
    const def = BRICK_ROW_DEFS[rowIndex];
    return Array.from({ length: COLS }, (_, colIndex) => ({
      alive: true,
      cssVar: def.cssVar,
      points: def.points,
      section: def.section,
      rowIndex,
      colIndex,
    }));
  });
}

// ── Physics init (task 9.5) ───────────────────────────────────────────────────

export function initPhysics(stage: number, canvasW: number, canvasH: number): GamePhysics {
  const speed = BASE_SPEED + (stage - 1) * 0.6;
  // Launch at ~-45° with a small random offset (-15° to +15°)
  const angleOffsetDeg = (Math.random() - 0.5) * 30;
  const angleDeg = -45 + angleOffsetDeg;
  const angleRad = (angleDeg * Math.PI) / 180;

  const ball: Ball = {
    x: canvasW / 2,
    y: canvasH - PADDLE_BOTTOM - PADDLE_HEIGHT - BALL_SIZE * 2,
    dx: Math.cos(angleRad) * speed,
    dy: Math.sin(angleRad) * speed,
  };

  const paddle: Paddle = {
    x: (canvasW - PADDLE_WIDTH) / 2,
    width: PADDLE_WIDTH,
  };

  return {
    ball,
    paddle,
    bricks: buildBricks(stage),
    scoreFloats: [],
  };
}

// ── Module state (task 9.7) ───────────────────────────────────────────────────

let physics: GamePhysics | null = null;
let animFrameId = 0;
let paddleTarget = 0;
let canvasRef: HTMLCanvasElement | null = null;
let unsubscribeStatus: (() => void) | null = null;

// ── Draw (task 10.1) ──────────────────────────────────────────────────────────

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  if (!physics) return;
  const { ball, paddle, bricks, scoreFloats } = physics;
  const style = getComputedStyle(document.documentElement);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw alive bricks
  for (const row of bricks) {
    for (const brick of row) {
      if (!brick.alive) continue;
      const color = style.getPropertyValue(brick.cssVar).trim();
      const rect = brickRect(brick.colIndex, brick.rowIndex, canvas.width);
      ctx.fillStyle = color;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
  }

  // Draw paddle
  const paddleColor = style.getPropertyValue("--paddle").trim() || "#ffffff";
  const paddleY = canvas.height - PADDLE_BOTTOM - PADDLE_HEIGHT;
  ctx.fillStyle = paddleColor;
  ctx.fillRect(paddle.x, paddleY, paddle.width, PADDLE_HEIGHT);

  // Draw ball
  const ballColor = style.getPropertyValue("--ball").trim() || "#00e5ff";
  ctx.fillStyle = ballColor;
  ctx.fillRect(ball.x - BALL_SIZE / 2, ball.y - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);

  // Draw score floats
  ctx.font = `7px "Press Start 2P", monospace`;
  for (const float of scoreFloats) {
    const alpha = Math.max(0, 1 - float.age / 60);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = paddleColor;
    ctx.fillText(float.text, float.x, float.y - float.age * 0.5);
  }
  ctx.globalAlpha = 1;
}

// ── Update (task 10.2 & 10.3 & 10.4) ─────────────────────────────────────────

function update(dt: number, canvasW: number, canvasH: number) {
  if (!physics) return;
  const { ball, paddle } = physics;

  // Move ball
  ball.x += ball.dx * dt;
  ball.y += ball.dy * dt;

  // Wall reflections
  if (ball.x - BALL_SIZE / 2 <= 0) {
    ball.x = BALL_SIZE / 2;
    ball.dx = Math.abs(ball.dx);
  }
  if (ball.x + BALL_SIZE / 2 >= canvasW) {
    ball.x = canvasW - BALL_SIZE / 2;
    ball.dx = -Math.abs(ball.dx);
  }
  if (ball.y - BALL_SIZE / 2 <= 0) {
    ball.y = BALL_SIZE / 2;
    ball.dy = Math.abs(ball.dy);
  }

  // Paddle follow
  const paddleCenter = paddle.x + paddle.width / 2;
  const diff = paddleTarget - paddleCenter;
  if (Math.abs(diff) > 2) {
    paddle.x += diff * 0.15;
  }
  paddle.x = Math.max(0, Math.min(canvasW - paddle.width, paddle.x));

  // Paddle collision
  const paddleY = canvasH - PADDLE_BOTTOM - PADDLE_HEIGHT;
  if (
    ball.y + BALL_SIZE / 2 >= paddleY &&
    ball.y - BALL_SIZE / 2 <= paddleY + PADDLE_HEIGHT &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    ball.y = paddleY - BALL_SIZE / 2;
    ball.dy = -Math.abs(ball.dy);
    // Adjust dx based on hit position
    const hitRatio = (ball.x - paddle.x) / paddle.width; // 0..1
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    const angle = (hitRatio - 0.5) * (Math.PI * 0.6); // -54° to +54°
    ball.dx = Math.sin(angle) * speed;
    ball.dy = -Math.abs(Math.cos(angle) * speed);
  }

  // Brick collisions
  const store = useGameStore.getState();
  for (const row of physics.bricks) {
    for (const brick of row) {
      if (!brick.alive) continue;
      const rect = brickRect(brick.colIndex, brick.rowIndex, canvasW);
      const bLeft = ball.x - BALL_SIZE / 2;
      const bRight = ball.x + BALL_SIZE / 2;
      const bTop = ball.y - BALL_SIZE / 2;
      const bBottom = ball.y + BALL_SIZE / 2;

      if (
        bRight > rect.x &&
        bLeft < rect.x + rect.w &&
        bBottom > rect.y &&
        bTop < rect.y + rect.h
      ) {
        brick.alive = false;
        // Determine reflect axis by smallest overlap
        const overlapX = Math.min(bRight - rect.x, rect.x + rect.w - bLeft);
        const overlapY = Math.min(bBottom - rect.y, rect.y + rect.h - bTop);
        if (overlapX < overlapY) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }

        // Score float
        if (physics.scoreFloats.length < 10) {
          physics.scoreFloats.push({
            x: rect.x + rect.w / 2,
            y: rect.y,
            text: `+${brick.points}`,
            age: 0,
          });
        }

        store.addScore(brick.points);

        // Check if full row is cleared
        const rowCleared = physics.bricks[brick.rowIndex].every((b) => !b.alive);
        if (rowCleared) {
          store.unlockSection(brick.section);
          store.setStatus("section_unlocked");
          store.setJustUnlocked(brick.section);
        }
      }
    }
  }

  // Age and remove score floats
  physics.scoreFloats = physics.scoreFloats
    .map((f) => ({ ...f, age: f.age + 1 }))
    .filter((f) => f.age < 60);

  // Bottom boundary — ball lost
  if (ball.y - BALL_SIZE / 2 > canvasH) {
    const lives = store.lives;
    store.setLives(lives - 1);
    store.setStatus(lives - 1 > 0 ? "lost_life" : "gameover");
  }
}

// ── Loop (task 10.5) ──────────────────────────────────────────────────────────

let lastTs = 0;

function loop(ts: number) {
  if (!canvasRef) return;
  const ctx = canvasRef.getContext("2d");
  if (!ctx) return;

  const elapsed = lastTs === 0 ? 16 : ts - lastTs;
  lastTs = ts;
  const dt = Math.min(elapsed, 32) / 16;

  update(dt, canvasRef.width, canvasRef.height);
  draw(ctx, canvasRef);

  animFrameId = requestAnimationFrame(loop);
}

function startLoop() {
  if (animFrameId) return;
  lastTs = 0;
  animFrameId = requestAnimationFrame(loop);
}

function stopLoop() {
  cancelAnimationFrame(animFrameId);
  animFrameId = 0;
  lastTs = 0;
}

// ── Status subscription (task 9.7) ───────────────────────────────────────────

export function initGame(canvas: HTMLCanvasElement) {
  canvasRef = canvas;
  paddleTarget = canvas.width / 2;

  // Unsubscribe any previous subscription
  unsubscribeStatus?.();

  unsubscribeStatus = useGameStore.subscribe(
    (s) => s.status,
    (status: GameStatus) => {
      switch (status) {
        case "playing":
          if (!physics) {
            const store = useGameStore.getState();
            physics = initPhysics(store.stage, canvas.width, canvas.height);
          }
          startLoop();
          break;

        case "lost_life":
          stopLoop();
          // Reset ball position above paddle, resume after 1200ms (task 10.6)
          if (physics) {
            physics.ball.x = canvas.width / 2;
            physics.ball.y = canvas.height - PADDLE_BOTTOM - PADDLE_HEIGHT - BALL_SIZE * 2;
            physics.ball.dx = BASE_SPEED * (Math.random() > 0.5 ? 1 : -1) * 0.7;
            physics.ball.dy = -BASE_SPEED;
          }
          setTimeout(() => {
            const current = useGameStore.getState().status;
            if (current === "lost_life") {
              useGameStore.getState().setStatus("playing");
            }
          }, 1200);
          break;

        case "section_unlocked":
          stopLoop();
          break;

        case "gameover":
        case "idle":
          stopLoop();
          break;

        case "stage_clear":
          stopLoop();
          break;
      }
    },
  );
}

// ── Public API (task 10.7) ────────────────────────────────────────────────────

export function launch() {
  const store = useGameStore.getState();
  if (store.status === "idle") {
    store.setStatus("playing");
  }
}

export function dismissUnlock() {
  const store = useGameStore.getState();
  store.setJustUnlocked(null);
  store.setStatus("playing");
  startLoop();
}

export function resetGame() {
  stopLoop();
  physics = null;
  useGameStore.getState().resetGame();
}

export function setPaddleTarget(x: number) {
  paddleTarget = x;
}

export function movePaddleLeft() {
  if (physics) {
    paddleTarget = physics.paddle.x - 20;
  }
}

export function movePaddleRight() {
  if (physics) {
    paddleTarget = physics.paddle.x + physics.paddle.width + 20;
  }
}

export function destroyGame() {
  stopLoop();
  physics = null;
  unsubscribeStatus?.();
  unsubscribeStatus = null;
  canvasRef = null;
}
