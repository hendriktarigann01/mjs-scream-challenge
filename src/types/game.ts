export type GamePhase =
  | "register"
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
  player: Player;
  durationMs: number; // how long they held the blow above threshold
  level: GameLevel;
  isWin: boolean;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  avatar: AvatarId;
  duration_ms: number; // longest continuous blow in ms
  level: string;
  created_at: string;
}
