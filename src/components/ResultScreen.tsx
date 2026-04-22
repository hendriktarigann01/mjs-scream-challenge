"use client";

import { useEffect, useState } from "react";
import { AUTO_RESET_MS } from "@/lib/scoreUtils";
import type { GameResult } from "@/types/game";

interface ResultScreenProps {
  result: GameResult;
  onReset: () => void;
}

export default function ResultScreen({ result, onReset }: ResultScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_RESET_MS / 1000);
  const { isWin } = result;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onReset]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: isWin ? "#0169dc" : "#0169dc" }}
    >
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
        <h1
          className="font-black uppercase leading-none text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 10vw, 6rem)",
          }}
        >
          {isWin ? "Congratulations!" : "So Close!"}
        </h1>

        <p className="text-white/70 tracking-widest text-sm uppercase">
          {isWin ? "You nailed it!" : "Give it another try!"}
        </p>

        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Next player in
          </p>
          <span
            className="text-white/80 text-4xl font-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {countdown}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {isWin && (
            <a
              href="https://mjs-spin-wheel.vercel.app/"
                rel="noopener noreferrer"
              className="bg-white text-[#0169dc] font-black tracking-widest uppercase rounded-full hover:bg-white/90 transition-all duration-200"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                padding: "12px 24px",
                display: "inline-block",
              }}
            >
              Spin the Wheel!
            </a>
          )}

          <button
            onClick={onReset}
            className="border-2 cursor-pointer border-white/30 text-white/70 text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all duration-200"
            style={{ padding: "12px 32px" }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
