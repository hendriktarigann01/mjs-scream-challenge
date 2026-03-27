export const AUTO_RESET_MS = 5000;

export const DB_FLOOR = -100;
export const DB_THRESHOLD = -60; // below this = silence, no contribution
export const DB_MAX = -10; // at or above = full power
export const DB_WIN_THRESHOLD = -20; // must sustain above this to build hold timer
export const WIN_HOLD_SECONDS = 3;

const DELTA_SCALE = 0.025; 
const DECAY_RATE = 0.003; 

export function dbToNormalized(db: number): number {
  // DB_THRESHOLD..DB_MAX → 0..1, quadratic so quiet barely contributes
  const clamped = Math.max(DB_THRESHOLD, Math.min(DB_MAX, db));
  const linear = (clamped - DB_THRESHOLD) / (DB_MAX - DB_THRESHOLD);
  return linear * linear;
}

export function accumulateDelta(db: number): number {
  return dbToNormalized(db) * DELTA_SCALE;
}

export function decayDelta(): number {
  return DECAY_RATE;
}

export function dbToDisplayPct(db: number): number {
  // PowerMeter visual: linear 0–100 between DB_THRESHOLD and DB_MAX
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
