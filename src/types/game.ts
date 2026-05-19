// Tujuan: Type definitions untuk game scream challenge
// Caller: Semua komponen game + hooks
// Main Exports: GameState, GameLevel, GameResult, LeaderboardEntry, Player, AvatarId

export type GameState =
  | "idle"
  | "instruction"
  | "countdown"
  | "playing"
  | "result";

export type GameLevel = "normal" | "hard";

export type AvatarId =
  | "profile-1"
  | "profile-2"
  | "profile-3"
  | "profile-4"
  | "profile-5"
  | "profile-6";

export interface Player {
  name: string;
  avatar: AvatarId;
}

export interface GameResult {
  /** Raw bar position (0–300) */
  barValue: number;
  /** Combo multiplier (1–5) */
  comboMultiplier: number;
  /** Final score = barValue × comboMultiplier (max 1500) */
  score: number;
  /** Display label */
  label: string;
  level: GameLevel;
  isWin: boolean;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  avatar: AvatarId;
  score: number; // final score (bar × combo)
  level: string;
  created_at: string;
}
