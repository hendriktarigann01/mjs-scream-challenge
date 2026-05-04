"use client";

import { cn } from "@/lib/utils";

interface IdleScreenProps {
  onStart: () => void;
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 max-w-xl w-full">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-brand-primary tracking-wide text-center text-7xl leading-none font-black uppercase">
            HOW LOUD IS YOUR VOICE?
          </h1>
        </div>

        <div
          className="text-xl animate-bounce text-brand-primary/80 tracking-widest uppercase"
          style={{ animationDuration: "2s" }}
        >
          Step up to the mic
        </div>
        <button
          onClick={onStart}
          className={cn(
            "w-64 h-16 px-12 py-3 rounded-full font-bold text-lg uppercase tracking-widest transition-all",
            "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
            "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
            "hover:brightness-105",
          )}
        >
          Play game
        </button>
      </div>
    </div>
  );
}
