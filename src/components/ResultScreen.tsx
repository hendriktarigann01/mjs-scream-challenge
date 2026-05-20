
"use client";

import { useEffect, useState } from "react";
import { AUTO_RESET_MS } from "@/lib/scoreUtils";
import type { GameResult, AvatarId } from "@/types/game";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/lib/utils";

interface ResultScreenProps {
  result: GameResult;
  onReset: () => void;
}

export default function ResultScreen({ result, onReset }: ResultScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_RESET_MS / 1000);
  const { isWin, score, comboMultiplier, barValue, label } = result;
  
  const { addScore } = useLeaderboard();

  useEffect(() => {
   const savedPlayer = localStorage.getItem("mjs_player_name") || "Anonymous";
    const savedAvatar = localStorage.getItem("mjs_player_avatar") || "profile-1";
    
    addScore({
      playerName: savedPlayer,
      avatar: savedAvatar as AvatarId,
      score: score,
      level: result.level,
    }).catch(console.error);
  }, [addScore, score, result.level]);

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
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8 w-full max-w-md">
        <h1
          className="font-black uppercase leading-none drop-shadow-lg"
          style={{
            fontSize: "clamp(3rem, 10vw, 5rem)",
            color: isWin ? "#32CD32" : "#FF4500",
          }}
        >
          {isWin ? "YOU SURVIVED!" : "TIME'S UP!"}
        </h1>

        <div className="bg-[#191B34] border-[3px] border-[#DE7A00] rounded-3xl p-6 shadow-[0_8px_0_0_#DE7A00] flex flex-col items-center gap-6 w-full">
          <p className="text-white tracking-widest text-2xl uppercase font-black">
            {label}
          </p>
          
          <div className="flex flex-col gap-3 w-full">
             <div className="flex justify-between items-center text-white/80 text-sm font-bold uppercase tracking-widest bg-white/5 rounded-xl p-3">
                <span>Bar Reached</span>
                <span className="text-white text-xl tabular-nums font-black">{barValue} / 300</span>
             </div>
             <div className="flex justify-between items-center text-white/80 text-sm font-bold uppercase tracking-widest bg-white/5 rounded-xl p-3">
                <span>Combo</span>
                <span className="text-[#FED500] text-2xl tabular-nums font-black">x{comboMultiplier}</span>
             </div>
             
             <div className="h-1 w-full bg-white/10 rounded-full my-2" />
             
             <div className="flex flex-col items-center gap-1 font-black uppercase tracking-widest">
                <span className="text-[#00AD01] text-sm">Final Score</span>
                <span className="text-white text-6xl tabular-nums">{score}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-brand-primary font-black text-sm tracking-widest uppercase">
            Next player in
          </p>
          <span className="text-brand-primary text-4xl font-black drop-shadow-sm tabular-nums">
            {countdown}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
          <button
            onClick={onReset}
            className={cn(
              "border-[3px] cursor-pointer border-brand-primary text-brand-primary text-sm tracking-widest uppercase rounded-full hover:bg-brand-primary hover:text-white transition-all duration-200 font-black",
              "bg-transparent active:translate-y-1"
            )}
            style={{ padding: "14px 32px" }}
          >
            Play Again
          </button>
          
          {isWin && (
             <a
               href="https://mjs-spin-wheel.vercel.app/"
               target="_blank"
               rel="noopener noreferrer"
               className={cn(
                 "bg-[#00AD01] text-white cursor-pointer text-sm tracking-widest uppercase rounded-full transition-all duration-200 font-black border-[3px] border-[#00AD01]",
                 "shadow-[0_4px_0_0_#007B00] active:translate-y-[4px] active:shadow-none hover:brightness-110"
               )}
               style={{ padding: "14px 32px" }}
             >
               Claim Prize
             </a>
          )}
        </div>
      </div>
    </div>
  );
}
