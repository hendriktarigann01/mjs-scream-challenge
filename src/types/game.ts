export type GameState =
  | "idle"
  | "instruction"
  | "countdown"
  | "playing"
  | "result";

export type GameLevel = "normal" | "hard";

export interface GameResult {
  score: number;
  maxVolume: number;
  label: string;
  level: GameLevel;
  isWin: boolean;
}
