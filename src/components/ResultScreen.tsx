"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AUTO_RESET_MS, formatDuration } from "@/lib/scoreUtils";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getAvatarSrc } from "@/components/constants/avatars";
import type { GameResult } from "@/types/game";

interface ResultScreenProps {
  result: GameResult;
  onReset: () => void;
}

export default function ResultScreen({ result, onReset }: ResultScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_RESET_MS / 1000);
  const hasSubmitted = useRef(false);
  const { addScore } = useLeaderboard();

  useEffect(() => {
    if (result.isWin && !hasSubmitted.current) {
      hasSubmitted.current = true;
      addScore({
        playerName: result.player.name,
        avatar: result.player.avatar,
        durationMs: result.durationMs,
        level: result.level,
      });
    }
  }, [result]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); onReset(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onReset]);

  return (
    <div className="bg-[#0D1F3C] text-white relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-16">
      <div
        className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          "bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)]",
          "bg-[size:60px_60px]",
        )}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative z-10 flex flex-col items-center gap-8 text-center px-8"
      >
        {/* Avatar */}
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white">
          <Image
            src={getAvatarSrc(result.player.avatar)}
            alt={result.player.name}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-white/80 tracking-widest uppercase" style={{ fontSize: "1.1rem" }}>
          {result.player.name}
        </p>

        {result.isWin ? (
          <>
            <h1
              className="font-black uppercase leading-none text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 7rem)" }}
            >
              You did it!
            </h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/50 tracking-widest uppercase" style={{ fontSize: "0.9rem" }}>
                Longest blow
              </p>
              <p className="text-white font-black" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                {formatDuration(result.durationMs)}
              </p>
            </div>
          </>
        ) : (
          <>
            <h1
              className="font-black uppercase leading-none text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 7rem)" }}
            >
              So Close!
            </h1>
            <p className="text-white/70 tracking-widest uppercase" style={{ fontSize: "1.1rem" }}>
              Give it another try!
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/50 tracking-widest uppercase" style={{ fontSize: "0.9rem" }}>
                Best blow
              </p>
              <p className="text-white font-black" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                {formatDuration(result.durationMs)}
              </p>
            </div>
          </>
        )}

        {/* Countdown */}
        <div className="flex flex-col items-center gap-1 mt-2">
          <p className="text-white/40 tracking-widest uppercase" style={{ fontSize: "0.9rem" }}>
            Next player in
          </p>
          <span
            className="text-white/70 font-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 7vw, 4rem)" }}
          >
            {countdown}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-5 mt-2">
          {result.isWin && (
            <a
              href="https://mjs-spin-wheel.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-72 text-center bg-white text-[#0169dc] font-black tracking-widest uppercase rounded-full hover:bg-white/90 transition-all duration-200"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.2rem",
                padding: "16px 0",
                display: "inline-block",
              }}
            >
              Spin the Wheel!
            </a>
          )}

          <button
            onClick={onReset}
            className="w-72 text-center border-2 border-white/30 text-white font-black tracking-widest uppercase rounded-full hover:bg-white/10 transition-all duration-200"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.2rem",
              padding: "16px 0",
            }}
          >
            Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}