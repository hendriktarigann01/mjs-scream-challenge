"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AUTO_RESET_MS } from "@/lib/scoreUtils";
import type { GameResult } from "@/types/game";

interface ResultScreenProps {
  result: GameResult;
  onReset: () => void;
}

export default function ResultScreen({
  result: _result,
  onReset,
}: ResultScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_RESET_MS / 1000);

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
      style={{ backgroundColor: "#0169dc" }}
    >
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
        {/* <Image src="/congrats.png" alt="Congratulations" fill className="object-contain" /> */}

        <h1
          className="font-black uppercase leading-none text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 10vw, 6rem)",
          }}
        >
          Congratulations!
        </h1>

        <p className="text-white/70 tracking-widest text-sm uppercase">
          You nailed it!
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

        <button
          onClick={onReset}
          className="px-8 py-3 border-2 border-white/30 text-white/70 text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
