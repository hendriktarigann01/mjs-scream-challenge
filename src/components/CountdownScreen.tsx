"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useMicrophone } from "@/hooks/useMicrophone";
import { GAME_CONFIG } from "@/lib/scoreUtils";

interface CountdownScreenProps {
  onComplete: (calibratedThreshold: number) => void;
}

const SEQUENCE = ["3", "2", "1", "BLOW!"];

export default function CountdownScreen({ onComplete }: CountdownScreenProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Buka mic selama countdown untuk sampling ambient noise
  const { db, isActive, start, stop } = useMicrophone();
  const samplesRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  // Start mic sekali saat pertama isActive tersedia
  useEffect(() => { start(); }, [start]);

  // Kumpulkan sampel ambient (buang nilai floor mic belum siap)
  useEffect(() => {
    if (!isActive) return;
    if (db > GAME_CONFIG.DB_FLOOR + 5) {
      samplesRef.current.push(db);
    }
  }, [db, isActive]);

  useEffect(() => {
    if (index >= SEQUENCE.length) {
      // Countdown selesai — hitung threshold dari sampel ambient
      stop(); // tutup mic, GameplayScreen akan buka ulang
      let threshold: number = GAME_CONFIG.DB_THRESHOLD; // fallback
      const samples = samplesRef.current;
      if (samples.length >= 5) {
        const sorted = [...samples].sort((a, b) => a - b);
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const calibrated = p95 + GAME_CONFIG.AMBIENT_OFFSET_DB;
        // Batasi: threshold tidak boleh lebih tinggi dari -45 dBFS
        // agar tiupan pelan tetap bisa terdeteksi
        threshold = Math.min(calibrated, -45);
      }
      onComplete(threshold);
      return;
    }

    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 700);
    const nextTimer = setTimeout(() => setIndex((i) => i + 1), 900);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [index, onComplete, stop]);

  const isScream = index === SEQUENCE.length - 1;
  const current  = SEQUENCE[index] ?? "";

  return (
    <div className="bg-[#0D1F3C] text-white relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
      <div
        className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          "bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)]",
          "bg-[size:45px_45px]",
        )}
      />
      <div
        className="transition-all duration-150"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.3)",
        }}
      >
        <span
          className="font-black uppercase leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isScream
              ? "clamp(4rem, 15vw, 10rem)"
              : "clamp(8rem, 25vw, 18rem)",
            color: "#FFFFFF",
            textShadow: isScream
              ? "0 0 80px #FFFFFF, 0 0 160px #FFFFFF66"
              : "0 0 40px #ffffff44",
            display: "block",
            textAlign: "center",
          }}
        >
          {current}
        </span>
      </div>
    </div>
  );
}
