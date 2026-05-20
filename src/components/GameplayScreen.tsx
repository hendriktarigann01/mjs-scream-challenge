"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import {
  GAME_DURATION_S,
  BAR_WIN,
  GRACE_PERIOD_S,
  dbToBarRate,
  getComboFromScore,
  getScoreLabel,
  getConfig,
} from "@/lib/scoreUtils";
import PowerMeter from "./PowerMeter";
import type { GameResult, GameLevel } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";

interface GameplayScreenProps {
  level: GameLevel;
  onFinish: (result: GameResult) => void;
}

export default function GameplayScreen({
  level,
  onFinish,
}: GameplayScreenProps) {
  const { db, isActive, error, start, stop } = useMicrophone();

  const barValueRef = useRef(0);
  const scoreRef = useRef(0);
  const graceTimerSecRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const [displayBarValue, setDisplayBarValue] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [graceTimeRemaining, setGraceTimeRemaining] = useState<number | null>(
    null,
  );

  const [isTestMode, setIsTestMode] = useState(false);

  const { DB_THRESHOLD } = getConfig(level);

  const finish = useCallback(
    (isWin: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      stop();

      const finalScore = Math.round(scoreRef.current);
      const label = getScoreLabel(finalScore);

      onFinish({
        barValue: Math.round(barValueRef.current),
        comboMultiplier: getComboFromScore(scoreRef.current),
        score: finalScore,
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
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finish(scoreRef.current >= BAR_WIN);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, finish]);

  useEffect(() => {
    if (!isActive || finishedRef.current) return;

    let animFrame: number;
    const tick = () => {
      const now = performance.now();
      const elapsedSec = lastTickRef.current
        ? (now - lastTickRef.current) / 1000
        : 0.016;
      lastTickRef.current = now;

      const effectiveDb = isTestMode ? -10 : db;
      const isScreaming = effectiveDb >= DB_THRESHOLD;

      if (isScreaming) {
        graceTimerSecRef.current = 0;
        setGraceTimeRemaining(null);

        const currentCombo = getComboFromScore(scoreRef.current);
        const rate = dbToBarRate(effectiveDb, level);
        const addedPoints = rate * currentCombo * elapsedSec;
        scoreRef.current += addedPoints;
        barValueRef.current = Math.min(BAR_WIN, scoreRef.current);
      } else {
        if (barValueRef.current > 0) {
          graceTimerSecRef.current += elapsedSec;
          if (graceTimerSecRef.current <= GRACE_PERIOD_S) {
            setGraceTimeRemaining(GRACE_PERIOD_S - graceTimerSecRef.current);
          } else {
            setGraceTimeRemaining(null);
          }
        }
      }

      setDisplayBarValue(Math.round(barValueRef.current));
      setCurrentScore(Math.round(scoreRef.current));
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [db, isActive, DB_THRESHOLD, level, finish, isTestMode]);

  const displayCombo = getComboFromScore(currentScore);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Visual 1: Flying Particles */}
      {/* <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center pb-20">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: p.xStart, y: 60, scale: 0.8 }} // from PowerMeter top
              animate={{ opacity: [0, 1, 0], x: p.xStart, y: -325, scale: 1.5 }} // to Score
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute font-black text-2xl text-[#FFFFFF]"
              style={{ textShadow: "0 4px 6px rgba(0,0,0,0.5)" }}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>//
      </div> */}

      {error && (
        <p className="text-red-400 text-sm absolute top-4 z-20">{error}</p>
      )}

      <div className="relative z-10 flex flex-col items-center gap-20 w-full px-8">
        <div className="flex flex-col items-center gap-20 relative w-full">
          <div className="flex flex-col items-center w-full  relative">
            <PowerMeter
              barValue={displayBarValue}
              currentScore={currentScore}
              comboMultiplier={displayCombo}
            />
          </div>

          <div className="flex gap-10">
            <div className="relative flex flex-col items-center">
              <div
                suppressHydrationWarning
                className="flex items-center justify-center bg-transparent rounded-full border-[4px] border-[#ffffff] shadow-[0_6px_0_0_#FFFFFF] h-20 px-12 min-w-[280px]"
              >
                <span className="font-black text-3xl tracking-[0.15em] text-[#FFFFFF] leading-none uppercase">
                  SCORE: {currentScore}
                </span>
              </div>
            </div>
            <div className="min-w-[200px] h-20">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={displayCombo}
                  suppressHydrationWarning
                  className="flex items-center justify-center bg-transparent rounded-full border-[4px] border-[#ffffff] shadow-[0_6px_0_0_#FFFFFF] px-12 h-full w-full"
                  initial={{ scale: 0.5, opacity: 0, y: -10 }}
                  animate={{
                    scale: [1.3, 0.95, 1.1, 1],
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{
                    duration: 0.45,
                    times: [0, 0.4, 0.7, 1],
                    ease: "easeOut",
                  }}
                >
                  <span className="font-black uppercase text-3xl tracking-[0.15em] text-[#FFFFFF] leading-none">
                    x{displayCombo}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <span
            className="font-black leading-none tabular-nums"
            style={{
              fontSize: "clamp(5rem,12vw,8rem)",
              color: "#FFFFFF",
            }}
          >
            {timeLeft}
          </span>
          <div className="h-10 flex items-center justify-center">
            {graceTimeRemaining !== null && (
              <p className="text-[#FFFFFF] font-black text-4xl tracking-widest animate-pulse">
                KEEP SCREAMING! {graceTimeRemaining.toFixed(1)}s
              </p>
            )}
          </div>
        </div>
      </div>

      {!isActive && !error && (
        <p className="text-[#005473]/60 text-sm animate-pulse font-bold tracking-widest absolute bottom-4">
          REQUESTING MICROPHONE...
        </p>
      )}

      <button
        onClick={() => setIsTestMode(!isTestMode)}
        className="absolute bottom-4 right-4 z-50 bg-white/50 hover:bg-white text-xs font-bold text-brand-primary px-3 py-2 rounded-lg border-2 border-brand-primary shadow-sm transition-colors"
      >
        {isTestMode ? "MUTE TEST" : "AUTO SCREAM"}
      </button>
    </div>
  );
}
