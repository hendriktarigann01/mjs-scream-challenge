// Tujuan: Konfigurasi game, konversi dB → bar delta, combo system, grace period
// Caller: GameplayScreen, PowerMeter, ResultScreen
// Main Exports: getConfig, dbToBarRate, getComboMultiplier, getBarZone, calculateFinalScore
// Side Effects: None

export const GAME_DURATION_S = 60;
export const BAR_WIN = 300;
export const SCORE_MAX = 1500;
export const AUTO_RESET_MS = 30000;
export const GRACE_PERIOD_S = 1.5;

export type GameLevel = "normal" | "hard";

/* ── Level config ───────────────────────────────────────────── */
interface LevelConfig {
  DB_FLOOR: number;
  DB_THRESHOLD: number; // minimum dB to register as screaming
  DB_MAX: number; // dB at which bar fills at max rate
  MAX_BAR_RATE: number; // bar units per second at max dB
}

const LEVELS: Record<GameLevel, LevelConfig> = {
  normal: {
    DB_FLOOR: -100,
    DB_THRESHOLD: -70,
    DB_MAX: -30,
    MAX_BAR_RATE: 12,
  },
  hard: {
    DB_FLOOR: -100,
    DB_THRESHOLD: -60,
    DB_MAX: -10,
    MAX_BAR_RATE: 8,
  },
};

export function getConfig(level: GameLevel) {
  return LEVELS[level];
}

/** Returns bar increment per second at given dB level */
export function dbToBarRate(db: number, level: GameLevel): number {
  const { DB_THRESHOLD, DB_MAX, MAX_BAR_RATE } = getConfig(level);
  if (db < DB_THRESHOLD) return 0;
  const normalized = Math.min(1, (db - DB_THRESHOLD) / (DB_MAX - DB_THRESHOLD));
  return normalized * MAX_BAR_RATE;
}

/* ── Bar zones (color + flavor text) ────────────────────────── */
export interface BarZone {
  from: number;
  to: number;
  color: string;
  flavorText: string;
}

export const BAR_ZONES: BarZone[] = [
  { from: 0, to: 100, color: "#00AD01", flavorText: "DON'T STOP!!! KEEP GOING!!!" },
  { from: 100, to: 150, color: "#FED500", flavorText: "PUSH HARDER!!! ALMOST THERE!!!" },
  { from: 150, to: 200, color: "#DE7A00", flavorText: "GIVE IT ALL!!! MAX IT OUT!!!" },
  { from: 200, to: 300, color: "#CC1517", flavorText: "LOUDER!!! YOU'RE ON FIRE!!!" },
];

export function getBarZone(barValue: number): BarZone {
  for (let i = BAR_ZONES.length - 1; i >= 0; i--) {
    if (barValue >= BAR_ZONES[i].from) return BAR_ZONES[i];
  }
  return BAR_ZONES[0];
}

export const COMBO_FLAVOR: Record<number, string> = {
  3: "UNSTOPPABLE!!! KEEP THE STREAK!!!",
  4: "LOUDER!!! YOU'RE ON FIRE!!!",
  5: "INSANE!!! BREAK THE LIMIT!!!",
};

export function getComboFromScore(score: number): number {
  if (score >= 1500) return 5;
  if (score >= 900) return 4;
  if (score >= 600) return 3;
  if (score >= 300) return 2;
  return 1;
}

/** Flavor text: combo flavor overrides zone flavor when applicable */
export function getFlavorText(barValue: number, comboMultiplier: number): string {
  if (COMBO_FLAVOR[comboMultiplier]) return COMBO_FLAVOR[comboMultiplier];
  return getBarZone(barValue).flavorText;
}

export function calculateFinalScore(score: number): number {
  return Math.round(score);
}

/** Label for result screen */
export function getScoreLabel(score: number): string {
  if (score >= 1200) return "LEGENDARY!";
  if (score >= 800) return "AMAZING!";
  if (score >= 500) return "GREAT JOB!";
  if (score >= 300) return "NICE!";
  return "TRY AGAIN";
}
