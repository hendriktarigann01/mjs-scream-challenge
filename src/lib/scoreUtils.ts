export const AUTO_RESET_MS = 30000;

export type GameLevel = "normal" | "hard"; // dipertahankan untuk GameResult type compat

export const GAME_CONFIG = {
  DB_FLOOR: -100,
  DB_THRESHOLD: -70,       // threshold fixed — naikkan jika noise bocor, turunkan jika deteksi lemah
  AMBIENT_OFFSET_DB: 8,
  STOP_GRACE_SECONDS: 5,
  CALIBRATION_MS: 1500,
  SUSTAINED_FRAMES: 3,
  METER_FULL_SECONDS: 20,
  MIN_BLOW_MS: 2000,       // harus meniup minimal 2 detik sebelum warning countdown aktif
} as const;

interface LevelConfig {
  DB_FLOOR: number;
  DB_THRESHOLD: number;
  DB_MAX: number;
  WIN_HOLD_SECONDS: number;
}

export const LEVELS: Record<GameLevel, LevelConfig> = {
  normal: { DB_FLOOR: -100, DB_THRESHOLD: -65, DB_MAX: -30, WIN_HOLD_SECONDS: 20 },
  hard:   { DB_FLOOR: -100, DB_THRESHOLD: -55, DB_MAX: -20, WIN_HOLD_SECONDS: 20 },
};

export function getConfig(level: GameLevel): LevelConfig {
  return LEVELS[level];
}

export function dbToDisplayPct(db: number, level: GameLevel): number {
  const { DB_THRESHOLD, DB_MAX } = getConfig(level);
  const clamped = Math.max(DB_THRESHOLD, Math.min(DB_MAX, db));
  return Math.round(((clamped - DB_THRESHOLD) / (DB_MAX - DB_THRESHOLD)) * 100);
}

export type BlowTier = "none" | "weak" | "medium" | "strong" | "max";

/** Tier berdasarkan durasi tiupan berkelanjutan — meter penuh di METER_FULL_SECONDS */
export function getBlowTierByTime(durationMs: number): BlowTier {
  if (durationMs <= 0) return "none";
  const pct = durationMs / (GAME_CONFIG.METER_FULL_SECONDS * 1000);
  if (pct < 0.25) return "weak";
  if (pct < 0.5)  return "medium";
  if (pct < 0.75) return "strong";
  return "max";
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${s}.${tenths}s`;
}
