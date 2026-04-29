"use client";

import { cn } from "@/lib/utils";
import type { GameLevel } from "@/types/game";

interface InstructionScreenProps {
  onStartGame: (level: GameLevel) => void;
}

const steps = [
  { number: "01", text: "Step close to the microphone" },
  { number: "02", text: "Choose your difficulty and get ready" },
  { number: "03", text: "SCREAM as loud as you can!" },
];

export default function InstructionScreen({
  onStartGame,
}: InstructionScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 max-w-xl w-full">
        <div className="flex flex-col gap-2">
          <h2
            className="text-brand-primary text-[clamp(2.5rem,8vw,5rem)] font-black uppercase text-center leading-tight" // Ubah none ke tight
            style={{
              letterSpacing: "0.05em",
            }}
          >
            How to Play
          </h2>
          <p
            className="text-brand-primary text-2xl font-black uppercase text-center leading-normal" // Ubah none ke normal
            style={{
              letterSpacing: "0.05em",
            }}
          >
            ARE YOU BRAVE ENOUGH?
          </p>
        </div>

        <div className="flex flex-col gap-12 w-full max-w-md">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-5">
              <span
                className="text-6xl font-black text-brand-primary leading-none"
                style={{
                  minWidth: "5rem",
                }}
              >
                {step.number}
              </span>
              <p className="text-brand-primary text-2xl tracking-wide">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => onStartGame("normal")}
            className={cn(
              "w-40 h-12 px-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
              "bg-[#C0E6F9] border-[3px] border-[#00698F] shadow-[0_4px_0_0_#00698F] text-brand-primary",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#00698F]",
              "hover:brightness-105",
            )}
          >
            Normal
          </button>

          <button
            onClick={() => onStartGame("hard")}
            className={cn(
              "w-40 h-12 px-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
              "bg-[#C0E6F9] border-[3px] border-[#00698F] shadow-[0_4px_0_0_#00698F] text-brand-primary",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#00698F]",
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
