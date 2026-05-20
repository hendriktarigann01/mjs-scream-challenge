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
  comboMultiplier: number;
  score: number;
  label: string;
  level: GameLevel;
  isWin: boolean;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  avatar: AvatarId;
  score: number;
  level: string;
  created_at: string;
}
