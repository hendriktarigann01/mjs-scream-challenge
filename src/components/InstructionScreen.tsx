"use client";

import { cn } from "@/lib/utils";
import type { GameLevel } from "@/types/game";

interface InstructionScreenProps {
  onStartGame: (level: GameLevel) => void;
}

const steps = [
  {
    number: "01",
    title: "STEP UP & GET READY",
    description: "Stand close. Focus. It's your moment.",
  },
  {
    number: "02",
    title: "SCREAM YOUR LOUDEST",
    description: "No holding back. Go all out!",
  },
  {
    number: "03",
    title: "CLIMB THE LEADERBOARD",
    description: "Beat the score. Own the spotlight.",
  },
];

export default function InstructionScreen({
  onStartGame,
}: InstructionScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12 py-10">
      <div className="relative z-10 flex flex-col items-center gap-24 px-8 max-w-4xl w-full">

        <div className="flex flex-col gap-6">
          <h2 className="text-white text-8xl font-black uppercase text-center leading-tight">
            How to Play
          </h2>
          <p
            className="text-white text-3xl font-black uppercase text-center leading-normal"
            style={{
              letterSpacing: "0.08em",
            }}
          >
            ARE YOU BRAVE ENOUGH?
          </p>
        </div>

        <div className="flex flex-col gap-18 w-full max-w-3xl">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-10">
              <span
                className="text-8xl font-black text-white leading-none"
                style={{ minWidth: "7.5rem" }}
              >
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-white text-3xl font-black uppercase tracking-tight">
                  {step.title}
                </p>
                <p className="text-white text-3xl tracking-wide leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-8">
          <button
            onClick={() => onStartGame("normal")}
            className={cn(
              "w-56 h-18 px-8 rounded-full font-black text-xl uppercase tracking-widest transition-all",
              "bg-transparent border-[4px] border-white shadow-[0_6px_0_0_#FFFFFF] text-white",
              "active:translate-y-[3px] active:shadow-[0_3px_0_0_#FFFFFF]",
              "hover:brightness-105",
            )}
          >
            Normal
          </button>

          <button
            onClick={() => onStartGame("hard")}
            className={cn(
              "w-56 h-18 px-8 rounded-full font-black text-xl uppercase tracking-widest transition-all",
              "bg-transparent border-[4px] border-white shadow-[0_6px_0_0_#FFFFFF] text-white",
              "active:translate-y-[3px] active:shadow-[0_3px_0_0_#FFFFFF]",
              "hover:brightness-105",
            )}
          >
            Hard
          </button>
        </div>
      </div>
    </div>
  );
}
