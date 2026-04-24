"use client";

import Image from "next/image";
import { getBlowTierByTime, type BlowTier } from "@/lib/scoreUtils";

interface PowerMeterProps {
  /** Durasi terbaik (max) yang sudah dicapai — bar hanya naik, tidak pernah turun */
  bestDurationMs: number;
  /** Apakah sedang aktif meniup — untuk animasi sway balon */
  isBlowing: boolean;
}

type SegmentKey = "weak" | "warm" | "strong" | "max";
const TIER_ORDER: SegmentKey[] = ["weak", "warm", "strong", "max"];

const SEGMENT_COLORS: Record<SegmentKey, string> = {
  weak: "#FF4500",
  warm: "#FF8C00",
  strong: "#FFD700",
  max: "#32CD32",
};

const FLAVOR_TEXT: Record<BlowTier, string> = {
  none: "Start blowing...",
  weak: "That's more like it!",
  medium: "Now we're talking!",
  strong: "Keep it going!",
  max: "YO that's insane!",
};

const TIER_ACTIVE: Record<BlowTier, number> = {
  none: 0, weak: 1, medium: 2, strong: 3, max: 4,
};

const BALLOON_SCALE: Record<BlowTier, number> = {
  none: 0.45, weak: 0.6, medium: 0.75, strong: 0.88, max: 1,
};

export default function PowerMeter({ bestDurationMs, isBlowing }: PowerMeterProps) {
  // Tier selalu berdasarkan capaian terbaik — bar tidak pernah turun
  const tier = getBlowTierByTime(bestDurationMs);
  const activeCount = TIER_ACTIVE[tier];
  const scale = BALLOON_SCALE[tier];

  return (
    <div className="flex flex-col items-center w-full max-w-sm select-none gap-6">
      {/* Flavor text */}
      <p
        className="text-white text-3xl text-center transition-all duration-300"
      >
        {FLAVOR_TEXT[tier]}
      </p>

      {/* Balloon + String */}
      <div className="flex flex-col items-center">
        <div
          className="transition-transform duration-700 ease-out"
          style={{ transform: `scale(${scale})`, transformOrigin: "bottom center" }}
        >
          <Image
            src="/power/balloon.webp"
            alt="balloon"
            width={220}
            height={260}
            className="object-contain"
            priority
          />
        </div>
        {/* Tali: berayun saat meniup */}
        <div
          className={isBlowing ? "animate-[sway_1.5s_ease-in-out_infinite]" : ""}
          style={{ marginTop: "-8px" }}
        >
          <Image
            src="/power/string.webp"
            alt="string"
            width={20}
            height={120}
            className="object-contain"
          />
        </div>
      </div>

      {/* Power bar — mengisi berdasarkan waktu terbaik */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex w-full h-4 rounded-full overflow-hidden gap-1">
          {TIER_ORDER.map((seg, i) => (
            <div
              key={seg}
              className="flex-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i < activeCount
                  ? SEGMENT_COLORS[seg]
                  : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <div className="flex w-full justify-between px-1">
          {TIER_ORDER.map((seg) => (
            <span
              key={seg}
              className="text-xs uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}
            >
              {seg.charAt(0).toUpperCase() + seg.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
