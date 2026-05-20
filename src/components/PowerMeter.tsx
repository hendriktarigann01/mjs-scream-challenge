"use client";

import Image from "next/image";
import { getFlavorText, BAR_WIN } from "@/lib/scoreUtils";

interface PowerMeterProps {
  barValue: number;
  currentScore: number;
  comboMultiplier: number;
}

export default function PowerMeter({
  barValue,
  currentScore,
  comboMultiplier,
}: PowerMeterProps) {
  const fillPct = Math.min(100, Math.max(0, (barValue / BAR_WIN) * 100));
  const flavorText = getFlavorText(barValue, comboMultiplier);

  let glowIntensity = 0;
  if (currentScore >= 300) {
    const progress = Math.min(1, (currentScore - 300) / 1200);
    glowIntensity = 0.4 + progress * 0.6;
  }

  const glowBlur = 15 + glowIntensity * 30;

  return (
    <div className="flex flex-col items-center gap-20 select-none relative w-full justify-center">
      <p className="text-white text-6xl tracking-widest uppercase font-black text-center">
        {flavorText}
      </p>

      <div className="relative w-full flex items-center justify-center">
        <div
          className="absolute left-0 flex-shrink-0"
          style={{ width: "200px", height: "600px" }}
        >
          <Image
            src="/common/power-meter.webp"
            alt="power meter"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        <div className="relative" style={{ width: "300px", height: "650px" }}>
          {glowIntensity > 0 && (
            <div
              className="absolute inset-0 z-40 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 120% 80% at 50% 35%, rgba(255, 255, 255, ${0.3 + glowIntensity * 0.6}) 0%, transparent 70%)`,
                filter: `blur(${glowBlur}px)`,
                opacity: glowIntensity,
                transform: `scale(${2 + glowIntensity * 0.5})`,
                transition:
                  "opacity 800ms ease, filter 800ms ease, transform 800ms ease",
              }}
            />
          )}

          <div className="absolute -inset-45 z-10">
            <Image
              src="/lamp.webp"
              alt="lamp base"
              fill
              className="object-contain"
              style={{ opacity: 0.35 }}
              unoptimized
              priority
            />
          </div>

          <div
            className="absolute -inset-45 z-40"
            style={{
              clipPath: `inset(${100 - fillPct}% 0 0 0)`,
              transition: "clip-path 150ms ease-out",
            }}
          >
            <Image
              src="/lamp.webp"
              alt="lamp filled"
              fill
              className="object-contain"
              style={{ opacity: 1 }}
              unoptimized
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
