"use client";

import { useEffect, useRef } from "react";
import { getFlavorText, BAR_ZONES, BAR_WIN } from "@/lib/scoreUtils";
import type { GameLevel } from "@/types/game";

interface PowerMeterProps {
  barValue: number;
  comboMultiplier: number;
}

const DIVIDER_COLOR = "#191B34";
const EMPTY_COLOR = "#D9D9D9";
const BAR_W = 28; // px — lebar bar utama
const DIV_W = 48; // px — lebar divider (lebih lebar = efek menonjol)
const DIV_H = 14; // px — tinggi divider
const ZONE_H = 72; // px — tinggi tiap zone

const Divider = () => (
  <div
    style={{
      width: `${DIV_W}px`,
      height: `${DIV_H}px`,
      background: DIVIDER_COLOR,
      borderRadius: "999px",
      flexShrink: 0,
      alignSelf: "center",
    }}
  />
);

export default function PowerMeter({ barValue, comboMultiplier }: PowerMeterProps) {
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate percentage 0-100 based on BAR_WIN
  const pct = Math.min(100, Math.max(0, (barValue / BAR_WIN) * 100));

  useEffect(() => {
    // BAR_ZONES are defined in terms of values (0-100, 100-150, 150-200, 200-300).
    // We map pct (0-100) to these zones. 
    // Since BAR_WIN is 300, pct represents the overall fill.
    // Let's use the actual value for filling.
    const currentValue = barValue;

    BAR_ZONES.forEach((zone, i) => {
      const el = zoneRefs.current[i];
      if (!el) return;

      if (currentValue >= zone.to) {
        el.style.background = zone.color;
      } else if (currentValue > zone.from) {
        const filledPct = ((currentValue - zone.from) / (zone.to - zone.from)) * 100;
        el.style.background = `linear-gradient(to top, ${zone.color} ${filledPct}%, ${EMPTY_COLOR} ${filledPct}%)`;
      } else {
        el.style.background = EMPTY_COLOR;
      }
    });
  }, [barValue]);

  // Render dari atas ke bawah: Divider, Zone[3], Divider, Zone[2], ..., Zone[0], Divider
  // BAR_ZONES dibalik supaya render atas = red, bawah = green
  const zonesTopToBottom = [...BAR_ZONES].reverse();
  const flavorText = getFlavorText(barValue, comboMultiplier);

  return (
    <div className="flex flex-col items-center gap-6 select-none relative w-full justify-center">
      <div
        className="flex flex-col items-center relative"
        style={{ width: `${DIV_W}px` }}
      >
        {zonesTopToBottom.map((zone, i) => {
          // index di zoneRefs tetap pakai original index (0=green, 3=red)
          const originalIndex = BAR_ZONES.length - 1 - i;
          return (
            <div key={zone.from} className="flex flex-col items-center w-full relative">
              <Divider />
              {/* Marker Text */}
              <div className="absolute right-[60px] top-[-8px]">
                <span className="text-[#191B34] font-bold text-lg font-sans tabular-nums">{zone.to}</span>
              </div>
              <div
                ref={(el) => {
                  zoneRefs.current[originalIndex] = el;
                }}
                style={{
                  width: `${BAR_W}px`,
                  height: `${ZONE_H}px`,
                  background: EMPTY_COLOR,
                  transition: "background 100ms",
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}
        {/* Divider paling bawah */}
        <div className="relative flex flex-col items-center w-full">
            <Divider />
            <div className="absolute right-[60px] top-[-8px]">
              <span className="text-[#191B34] font-bold text-lg font-sans tabular-nums">0</span>
            </div>
        </div>
      </div>

      <p className="text-[#191B34] text-sm tracking-widest uppercase font-black text-center mt-2 h-8">
        {flavorText}
      </p>
    </div>
  );
}
