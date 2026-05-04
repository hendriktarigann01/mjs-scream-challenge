"use client";

import { cn } from "@/lib/utils";
import type { GameLevel } from "@/types/game";

interface InstructionScreenProps {
  onStartGame: (level: GameLevel) => void;
}

const steps = [
  {
    number: "01",
    title: "GET IN POSITION",
    description: "Move closer to the mic and stay focused!",
  },
  {
    number: "02",
    title: "GO ALL OUT, SCREAM",
    description: "Let out your loudest voice now!",
  },
  {
    number: "03",
    title: "CHASE THE SCORE",
    description: "Check your result and beat other players!",
  },
];

export default function InstructionScreen({
  onStartGame,
}: InstructionScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 max-w-xl w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-brand-primary text-7xl font-black uppercase text-center leading-tight">
            How to Play
          </h2>
          <p
            className="text-brand-primary text-2xl font-black uppercase text-center leading-normal"
            style={{
              letterSpacing: "0.05em",
            }}
          >
            ARE YOU BRAVE ENOUGH?
          </p>
        </div>

        <div className="flex flex-col gap-10 w-full max-w-xl">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-6">
              <span
                className="text-7xl font-black text-brand-primary leading-none"
                style={{ minWidth: "5.5rem" }}
              >
                {step.number}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-brand-primary text-xl font-black uppercase tracking-tight">
                  {step.title}
                </p>
                {/* whitespace-nowrap ditambahkan agar teks tidak turun ke bawah */}
                <p className="text-brand-primary text-xl tracking-wide whitespace-nowrap">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => onStartGame("normal")}
            className={cn(
              "w-40 h-12 px-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
              "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
              "hover:brightness-105",
            )}
          >
            Normal
          </button>

          <button
            onClick={() => onStartGame("hard")}
            className={cn(
              "w-40 h-12 px-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
              "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
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
