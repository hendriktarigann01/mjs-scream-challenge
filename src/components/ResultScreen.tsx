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
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
        <h1
          className="font-black uppercase leading-none text-brand-primary"
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
          }}
        >
          {isWin ? "CONGRATULATION" : "SO CLOSE!"}
        </h1>

        <p className="text-brand-primary/80 tracking-widest text-sm uppercase font-black">
          {isWin ? "You nailed it!" : "Get it another next"}
        </p>

        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-brand-primary/60 text-sm tracking-widest uppercase font-black">
            Next player in
          </p>
          <span className="text-brand-primary text-4xl font-black">
            {countdown}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
          {isWin && (
            <a
              href="https://mjs-spin-wheel.vercel.app/"
              rel="noopener noreferrer"
              className="bg-[#C0E6F9] text-brand-primary font-black tracking-widest uppercase rounded-full hover:brightness-95 transition-all duration-200"
              style={{
                fontSize: "1rem",
                padding: "12px 24px",
                display: "inline-block",
                border: "3px solid #00698F",
              }}
            >
              Spin the Wheel!
            </a>
          )}

          <button
            onClick={onReset}
            className="border-2 cursor-pointer border-[#00698F] text-brand-primary text-sm tracking-widest uppercase rounded-full hover:bg-[#C0E6F9]/20 transition-all duration-200 font-black"
            style={{ padding: "12px 32px" }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
