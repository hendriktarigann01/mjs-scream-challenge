"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { useMicrophone } from "@/hooks/useMicrophone";
import {
  GAME_DURATION_S,
  BAR_WIN,
  GRACE_PERIOD_S,
  dbToBarRate,
  getComboFromScore,
  getScoreLabel,
  getConfig
} from "@/lib/scoreUtils";
import PowerMeter from "./PowerMeter";
import type { GameResult, GameLevel } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";

interface GameplayScreenProps {
  level: GameLevel;
  onFinish: (result: GameResult) => void;
}

export default function GameplayScreen({ level, onFinish }: GameplayScreenProps) {
  const { db, isActive, error, start, stop } = useMicrophone();

  const barValueRef = useRef(0);
  const scoreRef = useRef(0);
  const graceTimerSecRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const [displayBarValue, setDisplayBarValue] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [graceTimeRemaining, setGraceTimeRemaining] = useState<number | null>(null);

  interface Particle {
    id: number;
    text: string;
    key: string;
    xStart: number;
  }
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticleRef = useRef(0);
  const particleCounterRef = useRef(0);

  const [isTestMode, setIsTestMode] = useState(false);

  const { DB_THRESHOLD } = getConfig(level);

  const finish = useCallback((isWin: boolean) => {
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
  }, [onFinish, stop, level]);

  useEffect(() => {
    start();
  }, [start]);

  // Main game timer
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finish(scoreRef.current >= BAR_WIN); // Time expired, win if score >= 300
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, finish]);

  // High-frequency tick
  useEffect(() => {
    if (!isActive || finishedRef.current) return;

    let animFrame: number;
    const tick = () => {
      const now = performance.now();
      const elapsedSec = lastTickRef.current ? (now - lastTickRef.current) / 1000 : 0.016;
      lastTickRef.current = now;

      const effectiveDb = isTestMode ? -10 : db;
      const isScreaming = effectiveDb >= DB_THRESHOLD;

      if (isScreaming) {
        graceTimerSecRef.current = 0;
        setGraceTimeRemaining(null);

        const currentCombo = getComboFromScore(scoreRef.current);
        const rate = dbToBarRate(effectiveDb, level);

        // Boosted score based on combo
        const addedPoints = rate * currentCombo * elapsedSec;
        scoreRef.current += addedPoints;

        // Bar tracks score up to 300
        barValueRef.current = Math.min(BAR_WIN, scoreRef.current);

        // Spawn flying particles (Visual 1)
        if (now - lastParticleRef.current > 400) {
          lastParticleRef.current = now;
          particleCounterRef.current += 1;
          const isLeft = particleCounterRef.current % 2 === 0;
          const xStart = isLeft ? -80 : 80;

          const particleText = `+${Math.round(rate * currentCombo * 0.4)}`;
          const newParticle = { id: now, text: particleText, key: `p-${now}`, xStart };
          setParticles(prev => [...prev, newParticle]);
          setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== now));
          }, 800);
        }
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

  const effectiveDbForDisplay = isTestMode ? -10 : db;
  const isHolding = effectiveDbForDisplay >= DB_THRESHOLD;
  const holdPct = (displayBarValue / BAR_WIN) * 100;

  const displayCombo = getComboFromScore(currentScore);

  const showCombo3Gif = displayCombo >= 3;
  const showCombo5Gif = displayCombo >= 4;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">

      {/* Visual 1: Flying Particles */}
      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center pb-20">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: p.xStart, y: 60, scale: 0.8 }} // from PowerMeter top
              animate={{ opacity: [0, 1, 0], x: p.xStart, y: -325, scale: 1.5 }} // to Score
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute font-black text-2xl text-[#FF4500]"
              style={{ textShadow: "0 4px 6px rgba(0,0,0,0.5)" }}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      {error && <p className="text-red-400 text-sm absolute top-4 z-20">{error}</p>}

      <div className="relative z-10 flex flex-col items-center gap-10 w-full px-8">

        {/* Top Section: Score / Combo 5 */}
        <div className="relative flex flex-col items-center h-[120px]">
          {showCombo5Gif ? (
            <>
              <Image
                src="/common/combo-x5.gif"
                alt="combo x5"
                width={330}
                height={180}
                unoptimized
                className="object-contain z-10 absolute -top-24"
              />

              <div
                suppressHydrationWarning
                className="z-20 mt-12 flex items-center justify-center
          bg-white rounded-full
             border-[3px] border-[#DE7A00]
          shadow-[0_4px_0_0_#DE7A00]
          h-16 px-10 min-w-[220px]"
              >
                <span className="font-bold text-2xl tracking-[0.15em] text-[#DE7A00] leading-none">
                  {currentScore}
                </span>
              </div>
            </>
          ) : (
            <div
              suppressHydrationWarning
              className="z-20 mt-12 flex items-center justify-center
        bg-white rounded-full
           border-[3px] border-[#DE7A00]
          shadow-[0_4px_0_0_#DE7A00]
        h-16 px-10 min-w-[220px]"
            >
              <span className="font-bold text-2xl tracking-[0.15em] text-[#DE7A00] leading-none">
                {currentScore}
              </span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={displayCombo} // re-animates every time combo changes
            suppressHydrationWarning
            className="absolute right-[15%] top-[25%] 
    flex items-center justify-center
    bg-white rounded-full
    border-[3px] border-[#DE7A00]
    shadow-[0_4px_0_0_#DE7A00]
    px-10 h-14 min-w-[220px]"
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
            {/* Value Combo */}
            <span className="font-bold uppercase text-2xl tracking-[0.15em] text-[#DE7A00] leading-none">
              combo {displayCombo}x
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Middle Section: Meter and Combo 3 */}
        <div className="flex flex-col items-center gap-6 mt-4 relative w-full">

          <div className="flex flex-col items-center w-full relative">
            {/* Combo 3 Overlay Image */}
            <div className="h-[60px] flex justify-center items-end">
              {showCombo3Gif && (
                <Image
                  src="/common/combo-x3.gif"
                  alt="combo x3"
                  width={160}
                  height={60}
                  unoptimized
                  className="object-contain -mb-2 z-10"
                />
              )}
            </div>

            <div className="flex mt-2">
              <PowerMeter barValue={displayBarValue} comboMultiplier={displayCombo} />
            </div>
          </div>

          <div className="h-8 flex items-center justify-center -mt-2">
            {graceTimeRemaining !== null && (
              <p className="text-[#FF4500] font-black text-2xl tracking-widest animate-pulse">
                KEEP SCREAMING! {graceTimeRemaining.toFixed(1)}s
              </p>
            )}
          </div>

          {/* Countdown timer */}
          <span
            className="font-black leading-none tabular-nums"
            style={{
              fontSize: "clamp(3rem,10vw,5rem)",
              color: timeLeft <= 10 ? "#FF4500" : "#005473",
            }}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      {!isActive && !error && (
        <p className="text-[#005473]/60 text-sm animate-pulse font-bold tracking-widest absolute bottom-4">
          REQUESTING MICROPHONE...
        </p>
      )}

      {/* Test Mode Button */}
      <button
        onClick={() => setIsTestMode(!isTestMode)}
        className="absolute bottom-4 right-4 z-50 bg-white/50 hover:bg-white text-xs font-bold text-brand-primary px-3 py-2 rounded-lg border-2 border-brand-primary shadow-sm transition-colors"
      >
        {isTestMode ? "MUTE TEST" : "AUTO SCREAM"}
      </button>
    </div>
  );
}
