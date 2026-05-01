/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import {
  accumulateDelta,
  decayDelta,
  getScoreLabel,
  getConfig,
} from "@/lib/scoreUtils";
import PowerMeter from "./PowerMeter";
import type { GameResult, GameLevel } from "@/types/game";

interface GameplayScreenProps {
  level: GameLevel;
  onFinish: (result: GameResult) => void;
}

export default function GameplayScreen({
  level,
  onFinish,
}: GameplayScreenProps) {
  const { db, isActive, error, start, stop } = useMicrophone();

  const accScoreRef = useRef(0);
  const holdMsRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const { DB_WIN_THRESHOLD, WIN_HOLD_SECONDS } = getConfig(level);

  const finish = useCallback(
    (isWin: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      stop();
      const finalScore = Math.min(100, Math.round(accScoreRef.current));
      const { label } = getScoreLabel(finalScore);
      onFinish({
        score: finalScore,
        maxVolume: finalScore,
        label,
        level,
        isWin,
      });
    },
    [onFinish, stop, level],
  );

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finish(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finish]);

  useEffect(() => {
    if (!isActive || finishedRef.current) return;

    const now = performance.now();
    const elapsed = lastTickRef.current ? now - lastTickRef.current : 16;
    lastTickRef.current = now;

    if (db >= DB_WIN_THRESHOLD) {
      const delta = accumulateDelta(db, level);
      accScoreRef.current = Math.min(100, accScoreRef.current + delta);

      holdMsRef.current += elapsed;
      if (holdMsRef.current >= WIN_HOLD_SECONDS * 1000) {
        accScoreRef.current = 100;
        finish(true);
      }
    } else {
      holdMsRef.current = 0;
      accScoreRef.current = Math.max(
        0,
        accScoreRef.current - decayDelta(level),
      );
    }
  }, [db, isActive, finish, level, DB_WIN_THRESHOLD, WIN_HOLD_SECONDS]);

  const holdPct = Math.min(
    100,
    (holdMsRef.current / (WIN_HOLD_SECONDS * 1000)) * 100,
  );
  const isHolding = db >= DB_WIN_THRESHOLD;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
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
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full px-8">
        <div className="flex items-center gap-3">
          <h1
            className="text-brand-primary font-black uppercase text-[clamp(2rem,7vw,4rem)] leading-none"
            style={{
              letterSpacing: "0.1em",
            }}
          >
            SCREAM!
          </h1>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex flex-col items-center gap-6">
          {/* countdown timer */}
          <span
            className="font-black leading-none tabular-nums"
            style={{
              fontSize: "clamp(3rem,10vw,5rem)",
              color: timeLeft <= 5 ? "#FF4500" : "#005473",
            }}
          >
            {timeLeft}
          </span>

          <div className="flex">
            <PowerMeter db={db} level={level} />
          </div>

          <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
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
              className="text-brand-primary tracking-widest uppercase animate-pulse font-black"
              style={{
                fontSize: "1rem",
              }}
            >
              Keep going!{" "}
              {Math.ceil(WIN_HOLD_SECONDS - holdMsRef.current / 1000)}s
            </p>
          )}
        </div>

        {!isActive && !error && (
          <p className="text-brand-primary/60 text-sm animate-pulse">
            Requesting microphone...
          </p>
        )}
      </div>
    </div>
  );
}
