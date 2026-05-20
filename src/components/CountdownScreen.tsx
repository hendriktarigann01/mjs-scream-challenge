"use client";

import { useEffect, useState } from "react";

interface CountdownScreenProps {
  onComplete: () => void;
}

const SEQUENCE = ["3", "2", "1", "SCREAM!"];

export default function CountdownScreen({ onComplete }: CountdownScreenProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index >= SEQUENCE.length) {
      onComplete();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 700);
    const nextTimer = setTimeout(() => setIndex((i) => i + 1), 900);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [index, onComplete]);

  const isScream = index === SEQUENCE.length - 1;
  const current = SEQUENCE[index] ?? "";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-transparent">
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
            fontSize: isScream
              ? "clamp(4rem, 15vw, 10rem)"
              : "clamp(8rem, 25vw, 18rem)",
            color: isScream ? "#FFFFFF" : "#FFFFFF",
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
