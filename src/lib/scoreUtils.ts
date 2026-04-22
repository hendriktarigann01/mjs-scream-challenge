export const AUTO_RESET_MS = 30000;

export type GameLevel = "normal" | "hard";

interface LevelConfig {
  DB_FLOOR: number;
  DB_THRESHOLD: number;
  DB_MAX: number;
  DB_WIN_THRESHOLD: number;
  WIN_HOLD_SECONDS: number;
  DELTA_SCALE: number;
  DECAY_RATE: number;
}

const LEVELS: Record<GameLevel, LevelConfig> = {
  normal: {
    DB_FLOOR: -100,
    DB_THRESHOLD: -70,
    DB_MAX: -30,
    DB_WIN_THRESHOLD: -45,
    WIN_HOLD_SECONDS: 3,
    DELTA_SCALE: 0.04,
    DECAY_RATE: 0.002,
  },
  hard: {
    DB_FLOOR: -100,
    DB_THRESHOLD: -60,
    DB_MAX: -10,
    DB_WIN_THRESHOLD: -20,
    WIN_HOLD_SECONDS: 3,
    DELTA_SCALE: 0.025,
    DECAY_RATE: 0.003,
  },
};

export function getConfig(level: GameLevel): LevelConfig {
  return LEVELS[level];
}

export function dbToNormalized(db: number, level: GameLevel): number {
  const { DB_THRESHOLD, DB_MAX } = getConfig(level);
  const clamped = Math.max(DB_THRESHOLD, Math.min(DB_MAX, db));
  const linear = (clamped - DB_THRESHOLD) / (DB_MAX - DB_THRESHOLD);
  return linear * linear;
}

export function accumulateDelta(db: number, level: GameLevel): number {
  const { DELTA_SCALE } = getConfig(level);
  return dbToNormalized(db, level) * DELTA_SCALE;
}

export function decayDelta(level: GameLevel): number {
  return getConfig(level).DECAY_RATE;
}

export function dbToDisplayPct(db: number, level: GameLevel): number {
  const { DB_THRESHOLD, DB_MAX } = getConfig(level);
  const clamped = Math.max(DB_THRESHOLD, Math.min(DB_MAX, db));
  return Math.round(((clamped - DB_THRESHOLD) / (DB_MAX - DB_THRESHOLD)) * 100);
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "LEGENDARY!", color: "#FF4500" };
  if (score >= 65) return { label: "AMAZING!", color: "#FF8C00" };
  if (score >= 45) return { label: "GOOD JOB!", color: "#FFD700" };
  if (score >= 25) return { label: "NOT BAD", color: "#00CED1" };
  return { label: "TRY AGAIN", color: "#9370DB" };
}
