"use client";

import { useEffect, useRef } from "react";
import { dbToDisplayPct } from "@/lib/scoreUtilsDev";

interface PowerMeterProps {
  db: number; // dBFS,
}

const LIGHTNING_ID = "lightningClip";

export default function PowerMeter({ db }: PowerMeterProps) {
  const instantPct = dbToDisplayPct(db);
  const fillRef = useRef<SVGRectElement>(null);
  const glowRef = useRef<SVGRectElement>(null);
  const smoothedPctRef = useRef(0); // smoothed display value — can go up fast, down slow

  useEffect(() => {
    const current = smoothedPctRef.current;

    if (instantPct > current) {
      // rise immediately
      smoothedPctRef.current = instantPct;
    } else {
      // decay slowly — at most 2 units per tick
      smoothedPctRef.current = Math.max(0, current - 2);
    }

    const pct = smoothedPctRef.current;
    const svgHeight = 100;
    const fillHeight = (pct / 100) * svgHeight;
    const yPos = svgHeight - fillHeight;

    if (fillRef.current) {
      fillRef.current.setAttribute("y", `${yPos}`);
      fillRef.current.setAttribute("height", `${fillHeight}`);
    }

    if (glowRef.current) {
      glowRef.current.setAttribute("y", `${yPos}`);
      glowRef.current.setAttribute("height", `${fillHeight}`);
      glowRef.current.style.opacity = pct > 10 ? "1" : "0";
    }
  }, [instantPct]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width="80"
          height="160"
          viewBox="0 0 60 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            <clipPath id={LIGHTNING_ID}>
              <polygon points="38,2 18,52 32,52 22,98 52,38 36,38 50,2" />
            </clipPath>

            <filter
              id="lightningGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ghost bolt */}
          <polygon
            points="38,2 18,52 32,52 22,98 52,38 36,38 50,2"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Glow layer */}
          <rect
            ref={glowRef}
            x="-10"
            y="100"
            width="80"
            height="0"
            fill="white"
            clipPath={`url(#${LIGHTNING_ID})`}
            filter="url(#lightningGlow)"
            opacity="0"
            style={{
              transition:
                "y 0.1s ease-out, height 0.1s ease-out, opacity 0.2s ease",
            }}
          />

          {/* Fill layer */}
          <rect
            ref={fillRef}
            x="-10"
            y="100"
            width="80"
            height="0"
            fill="white"
            clipPath={`url(#${LIGHTNING_ID})`}
            style={{ transition: "y 0.1s ease-out, height 0.1s ease-out" }}
          />
        </svg>
      </div>

      <p className="text-white/50 text-sm tracking-widest uppercase">Power</p>
    </div>
  );
}
