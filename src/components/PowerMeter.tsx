"use client";

import { useEffect, useRef } from "react";
import { dbToDisplayPct } from "@/lib/scoreUtils";
import type { GameLevel } from "@/types/game";

interface PowerMeterProps {
  db: number;
  level: GameLevel;
}

export default function PowerMeter({ db, level }: PowerMeterProps) {
  const instantPct = dbToDisplayPct(db, level);
  const smoothedPctRef = useRef(0);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = smoothedPctRef.current;

    if (instantPct > current) {
      smoothedPctRef.current = instantPct;
    } else {
      smoothedPctRef.current = Math.max(0, current - 2);
    }

    if (fillRef.current) {
      fillRef.current.style.height = `${smoothedPctRef.current}%`;
    }
  }, [instantPct]);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div className="w-10 h-64 bg-white/30 rounded-2xl overflow-hidden flex flex-col-reverse">
        <div
          ref={fillRef}
          className="w-full transition-all duration-100"
          style={{
            height: "0%",
            background: "white",
          }}
        />
      </div>

      <p className="text-[#005473]/70 text-sm tracking-widest uppercase font-black">
        Power
      </p>
    </div>
  );
}
