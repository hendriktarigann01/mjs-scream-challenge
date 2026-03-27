"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import {
  accumulateDelta,
  decayDelta,
  getScoreLabel,
  DB_WIN_THRESHOLD,
  WIN_HOLD_SECONDS,
} from "@/lib/scoreUtils";
import PowerMeter from "./PowerMeter";
import type { GameResult } from "@/types/game";

interface GameplayScreenProps {
  onFinish: (result: GameResult) => void;
}

export default function GameplayScreen({ onFinish }: GameplayScreenProps) {
  const { db, isActive, error, start, stop } = useMicrophone();

  const accScoreRef = useRef(0); // 0–100, accumulated score
  const holdMsRef = useRef(0); // ms spent above DB_WIN_THRESHOLD continuously
  const lastTickRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stop();
    const finalScore = Math.min(100, Math.round(accScoreRef.current));
    const { label } = getScoreLabel(finalScore);
    onFinish({ score: finalScore, maxVolume: finalScore, label });
  }, [onFinish, stop]);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (!isActive || finishedRef.current) return;

    const now = performance.now();
    const elapsed = lastTickRef.current ? now - lastTickRef.current : 16;
    lastTickRef.current = now;

    if (db >= DB_WIN_THRESHOLD) {
      // above threshold: accumulate score + build hold timer
      const delta = accumulateDelta(db);
      accScoreRef.current = Math.min(100, accScoreRef.current + delta);

      holdMsRef.current += elapsed;
      if (holdMsRef.current >= WIN_HOLD_SECONDS * 1000) {
        // held long enough — force score to 100 and finish
        accScoreRef.current = 100;
        finish();
      }
    } else {
      // below threshold: reset hold timer, decay score slowly
      holdMsRef.current = 0;
      const decay = decayDelta();
      accScoreRef.current = Math.max(0, accScoreRef.current - decay);
    }
  }, [db, isActive, finish]);

  // hold progress as 0–100 for the visual ring
  const holdPct = Math.min(
    100,
    (holdMsRef.current / (WIN_HOLD_SECONDS * 1000)) * 100,
  );
  const isHolding = db >= DB_WIN_THRESHOLD;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-transparent">
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-75"
        style={{
          background: isHolding
            ? `radial-gradient(ellipse at center, #FF4500${Math.round(
                holdPct * 0.8,
              )
                .toString(16)
                .padStart(2, "0")} 0%, transparent 65%)`
            : "none",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full px-8">
        <h1
          className="text-white font-black uppercase text-[clamp(2rem,7vw,4rem)] leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          SCREAM!
        </h1>

        {error && <p className="text-white-400 text-sm">{error}</p>}

        {/* TEMP DEBUG — remove after calibration */}
        <p className="text-white/60 font-mono text-lg">{db.toFixed(1)} dBFS</p>

        <div className="flex h-[300px] flex-col items-center gap-6">
          <PowerMeter db={db} />

          {/* Hold progress indicator — only visible when above threshold */}
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${holdPct}%`,
                background: isHolding
                  ? "linear-gradient(90deg, #FFD700, #FF4500)"
                  : "transparent",
              }}
            />
          </div>

          {isHolding && (
            <p
              className="text-white text-xs tracking-widest uppercase animate-pulse"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1rem",
              }}
            >
              Keep going!{" "}
              {Math.ceil(WIN_HOLD_SECONDS - holdMsRef.current / 1000)}s
            </p>
          )}
        </div>

        {!isActive && !error && (
          <p className="text-white/40 text-sm animate-pulse">
            Requesting microphone...
          </p>
        )}
      </div>
    </div>
  );
}
