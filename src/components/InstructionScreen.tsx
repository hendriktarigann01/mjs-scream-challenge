"use client";

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
        <h2
          className="text-white text-[clamp(2.5rem,8vw,5rem)] font-black uppercase text-center leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          How to Play
        </h2>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-5">
              <span
                className="text-5xl font-black text-white/50 leading-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  minWidth: "3rem",
                }}
              >
                {step.number}
              </span>
              <p className="text-white text-xl tracking-wide">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onStartGame("normal")}
            className="w-36 h-10 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm tracking-widest uppercase rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            Normal
          </button>
          <button
            onClick={() => onStartGame("hard")}
            className="w-36 h-10 bg-[#FF4500]/70 hover:bg-[#FF4500]/90 border border-[#FF4500] text-white text-sm tracking-widest uppercase rounded-xl transition-all duration-200"
          >
            Hard
          </button>
        </div>
      </div>
    </div>
  );
}
