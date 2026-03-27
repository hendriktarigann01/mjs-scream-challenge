export type GameState =
  | "idle"
  | "instruction"
  | "countdown"
  | "playing"
  | "result";

export interface GameResult {
  score: number;
  maxVolume: number;
  label: string;
}
