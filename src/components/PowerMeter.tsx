"use client";

import { useEffect, useRef } from "react";
import { dbToDisplayPct } from "@/lib/scoreUtils";
import type { GameLevel } from "@/types/game";

interface PowerMeterProps {
  db: number;
  level: GameLevel;
}

// Index 0 = bottom (green), index 3 = top (red)
const ZONES = [
  { color: "#00AD01", from: 0, to: 25 },
  { color: "#FED500", from: 25, to: 50 },
  { color: "#DE7A00", from: 50, to: 75 },
  { color: "#CC1517", from: 75, to: 100 },
];

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

export default function PowerMeter({ db, level }: PowerMeterProps) {
  const instantPct = dbToDisplayPct(db, level);
  const smoothedPctRef = useRef(0);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const current = smoothedPctRef.current;
    if (instantPct > current) {
      smoothedPctRef.current = instantPct;
    } else {
      smoothedPctRef.current = Math.max(0, current - 2);
    }

    const pct = smoothedPctRef.current;

    ZONES.forEach((zone, i) => {
      const el = zoneRefs.current[i];
      if (!el) return;

      if (pct >= zone.to) {
        el.style.background = zone.color;
      } else if (pct > zone.from) {
        const filledPct = ((pct - zone.from) / (zone.to - zone.from)) * 100;
        el.style.background = `linear-gradient(to top, ${zone.color} ${filledPct}%, ${EMPTY_COLOR} ${filledPct}%)`;
      } else {
        el.style.background = EMPTY_COLOR;
      }
    });
  }, [instantPct]);

  // Render dari atas ke bawah: Divider, Zone[3], Divider, Zone[2], ..., Zone[0], Divider
  // ZONES dibalik supaya render atas = red, bawah = green
  const zonesTopToBottom = [...ZONES].reverse();

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      <div
        className="flex flex-col items-center"
        style={{ width: `${DIV_W}px` }}
      >
        {zonesTopToBottom.map((zone, i) => {
          // index di zoneRefs tetap pakai original index (0=green, 3=red)
          const originalIndex = ZONES.length - 1 - i;
          return (
            <div key={zone.from} className="flex flex-col items-center w-full">
              <Divider />
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
        <Divider />
      </div>

      <p className="text-[#005473]/70 text-sm tracking-widest uppercase font-black">
        Power
      </p>
    </div>
  );
}
