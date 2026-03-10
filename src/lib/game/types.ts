export type GameStatus =
  | "idle"
  | "launching"
  | "playing"
  | "paused"
  | "lost_life"
  | "stage_clear"
  | "section_unlocked"
  | "gameover";

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface Paddle {
  x: number;
  width: number;
}

export interface Brick {
  alive: boolean;
  cssVar: string;
  points: number;
  section: string;
  rowIndex: number;
  colIndex: number;
}

export interface ScoreFloat {
  x: number;
  y: number;
  text: string;
  age: number;
}

export interface GamePhysics {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[][];
  scoreFloats: ScoreFloat[];
}
