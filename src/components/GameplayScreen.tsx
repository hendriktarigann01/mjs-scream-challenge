"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMicrophone } from "@/hooks/useMicrophone";
import { GAME_CONFIG, formatDuration } from "@/lib/scoreUtils";
import PowerMeter from "@/components/PowerMeter";
import type { GameResult, Player } from "@/types/game";
import type { GameLevel } from "@/lib/scoreUtils";

interface GameplayScreenProps {
  player: Player;
  level: GameLevel;
  calibratedThreshold: number | null; // dari kalibrasi ambient di CountdownScreen
  onFinish: (result: GameResult) => void;
}

const { STOP_GRACE_SECONDS, SUSTAINED_FRAMES, DB_THRESHOLD, MIN_BLOW_MS } = GAME_CONFIG;

export default function GameplayScreen({ player, level, calibratedThreshold, onFinish }: GameplayScreenProps) {
  const { db, isActive, error, start, stop } = useMicrophone();
  // Gunakan threshold dari kalibrasi countdown; fallback ke default jika tidak ada
  const threshold = calibratedThreshold ?? DB_THRESHOLD;

  const [isBlowing, setIsBlowing] = useState(false);
  const [bestMs, setBestMs] = useState(0);
  const [warningSecsLeft, setWarningSecsLeft] = useState<number | null>(null);

  const blowStartRef = useRef<number | null>(null);
  const totalDurationRef = useRef(0);
  const hasStartedRef = useRef(false);
  const finishedRef = useRef(false);
  const consecutiveRef = useRef(0);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningCountRef = useRef(STOP_GRACE_SECONDS);

  const clearStopCountdown = useCallback(() => {
    if (stopTimerRef.current) { clearTimeout(stopTimerRef.current); stopTimerRef.current = null; }
    if (warningIntervalRef.current) { clearInterval(warningIntervalRef.current); warningIntervalRef.current = null; }
    setWarningSecsLeft(null);
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearStopCountdown();
    stop();
    setTimeout(() => {
      onFinish({ player, durationMs: totalDurationRef.current, level, isWin: hasStartedRef.current });
    }, 0);
  }, [onFinish, stop, player, level, clearStopCountdown]);

  useEffect(() => { start(); }, [start]);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    };
  }, []);

  // Deteksi tiupan — threshold fixed, tidak ada kalibrasi
  useEffect(() => {
    if (!isActive || finishedRef.current) return;

    const aboveThreshold = db >= threshold;
    if (aboveThreshold) {
      consecutiveRef.current++;
    } else {
      consecutiveRef.current = 0;
    }

    const blowing = consecutiveRef.current >= SUSTAINED_FRAMES;
    setIsBlowing(blowing);

    if (blowing) {
      clearStopCountdown();

      if (blowStartRef.current === null) {
        blowStartRef.current = performance.now();
        hasStartedRef.current = true;
      }

      const segmentMs = performance.now() - blowStartRef.current;
      setBestMs(totalDurationRef.current + segmentMs);

    } else {
      if (blowStartRef.current !== null) {
        totalDurationRef.current += performance.now() - blowStartRef.current;
        setBestMs(totalDurationRef.current);
        blowStartRef.current = null;
      }

      // Warning hanya muncul jika sudah meniup >= MIN_BLOW_MS (mencegah false positive dari noise)
      if (hasStartedRef.current && totalDurationRef.current >= MIN_BLOW_MS && !stopTimerRef.current) {
        warningCountRef.current = STOP_GRACE_SECONDS;
        setWarningSecsLeft(STOP_GRACE_SECONDS);

        warningIntervalRef.current = setInterval(() => {
          warningCountRef.current -= 1;
          setWarningSecsLeft(warningCountRef.current);
          if (warningCountRef.current <= 0) {
            if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
            warningIntervalRef.current = null;
          }
        }, 1000);

        stopTimerRef.current = setTimeout(() => { finish(); }, STOP_GRACE_SECONDS * 1000);
      }
    }
  }, [db, isActive, finish, clearStopCountdown]);

  return (
    <div className="bg-[#0D1F3C] text-white relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-16">
      <div className={cn(
        "absolute inset-0 z-0 pointer-events-none",
        "bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)]",
        "bg-[size:60px_60px]",
      )} />

      {/* Warning overlay */}
      <AnimatePresence>
        {warningSecsLeft !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <p className="text-white/80 tracking-widest uppercase mb-3" style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>
              Keep blowing!
            </p>
            <span
              className="font-black leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(8rem, 22vw, 14rem)",
                color: warningSecsLeft <= 2 ? "#FF4500" : "#FFFFFF",
                textShadow: warningSecsLeft <= 2 ? "0 0 40px #FF4500" : "none",
              }}
            >
              {warningSecsLeft}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full px-8">

        {/* {error && <p className="text-red-400" style={{ fontSize: "1.1rem" }}>{error}</p>} */}

        <div className="flex flex-col items-center gap-8 w-full">
          <PowerMeter bestDurationMs={bestMs} isBlowing={isBlowing} />

          <div className="h-8 flex items-center justify-center">
            <AnimatePresence>
              {bestMs > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/50 tracking-widest uppercase"
                  style={{ fontSize: "1.1rem" }}
                >
                  {formatDuration(bestMs)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isActive && !error && (
          <p className="text-white/40 animate-pulse" style={{ fontSize: "1.1rem" }}>
            Requesting microphone...
          </p>
        )}
      </div>
    </div>
  );
}