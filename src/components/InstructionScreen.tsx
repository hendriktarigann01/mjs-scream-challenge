"use client";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "BLOW INTO THE MIC",
    subtitle: "Get close and blow (do not speak)",
  },
  {
    number: "02",
    title: "KEEP IT STEADY",
    subtitle: "Maintain your airflow in the target zone",
  },
  {
    number: "03",
    title: "HOLD AS LONG AS YOU CAN",
    subtitle: "The longer you stay stable, the higher your score",
  },
];

interface InstructionScreenProps {
  onStartGame: () => void;
}

export default function InstructionScreen({ onStartGame }: InstructionScreenProps) {
  return (
    <div className="bg-[#0D1F3C] text-white relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-16">
      <div
        className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          "bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)]",
          "bg-[size:60px_60px]",
        )}
      />
      <div className="relative z-10 flex flex-col items-center gap-20 px-12 max-w-2xl w-full">
        <h2
          className="text-white uppercase text-center leading-none"
          style={{ fontSize: "clamp(3.5rem, 8vw, 5rem)", letterSpacing: "0.05em" }}
        >
          How to Play
        </h2>

        <div className="flex flex-col gap-14 w-full">
          {steps.map((step) => (
            <div key={step.number} className="grid grid-cols-[130px_1fr] items-start gap-8">
              <span className="text-white leading-none text-right" style={{ fontSize: "clamp(5rem, 12vw, 7rem)" }}>
                {step.number}
              </span>
              <div className="flex flex-col gap-1 pt-2">
                <h3 className="text-white/80 font-medium" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-white/50" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
                    {step.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStartGame}
          className="w-56 h-14 bg-white/20 hover:bg-white/30 border border-white/30 text-white tracking-widest uppercase rounded-xl transition-all duration-200 backdrop-blur-sm"
          style={{ fontSize: "1rem" }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}