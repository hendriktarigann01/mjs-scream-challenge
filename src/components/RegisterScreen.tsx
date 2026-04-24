"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AVATAR_IDS, getAvatarSrc } from "@/components/constants/avatars";
import type { AvatarId, Player, GameLevel } from "@/types/game";

interface RegisterScreenProps {
  onConfirm: (player: Player, level: GameLevel) => void;
}

export default function RegisterScreen({ onConfirm }: RegisterScreenProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("profile-1");

  const canPlay = name.trim().length > 0;

  return (
    <div className="bg-[#0D1F3C] text-white relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-16">
      <div
        className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          "bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)]",
          "bg-[size:60px_60px]",
        )}
      />
      <div className="z-10 flex flex-col items-center gap-14 max-w-xl w-full">
        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-white font-light leading-none text-center tracking-wider uppercase"
            style={{ fontSize: "clamp(2.8rem, 7vw, 4rem)" }}
          >
            THE LAST BREATH
          </h1>
          <p className="text-white/60 tracking-widest uppercase text-center font-light" style={{ fontSize: "0.85rem" }}>
            YOUR BREATH BUILDS THE STRUCTURE
          </p>
        </div>

        {/* Name input */}
        <div className="flex flex-col items-center gap-4 w-full">
          <label className="text-brand-primary uppercase tracking-[0.2em] font-light" style={{ fontSize: "1rem" }}>
            ENTER YOUR NAME
          </label>
          <div className="relative w-full">
            <div className="absolute inset-1 border-2 border-dashed border-brand-primary pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Your Name Here"
              className="w-full h-16 px-6 text-center font-light bg-[#0a192f] text-brand-primary border-2 border-brand-primary uppercase tracking-[0.2em] placeholder:text-brand-primary/40 focus:outline-none"
              style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}
              onKeyDown={(e) =>
                e.key === "Enter" && canPlay && onConfirm({ name: name.trim(), avatar }, "normal")
              }
            />
          </div>
        </div>

        {/* Avatar grid */}
        <div className="flex flex-col items-center gap-4 w-full">
          <label className="uppercase tracking-widest font-light" style={{ fontSize: "1rem" }}>
            SELECT YOUR AVATAR
          </label>
          <div className="grid grid-cols-3 gap-5">
            {AVATAR_IDS.map((id) => (
              <motion.button
                key={id}
                onClick={() => setAvatar(id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  "relative w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-200",
                  avatar === id
                    ? "border-brand-primary ring-2 ring-brand-primary/40"
                    : "border-transparent opacity-60 hover:opacity-90",
                )}
              >
                <Image src={getAvatarSrc(id)} alt={id} fill className="object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 w-full">
          <motion.button
            onClick={() => canPlay && onConfirm({ name: name.trim(), avatar }, "normal")}
            disabled={!canPlay}
            whileHover={canPlay ? { scale: 1.02 } : {}}
            whileTap={canPlay ? { scale: 0.97 } : {}}
            className={cn(
              "relative flex items-center justify-center w-full h-16 uppercase tracking-[0.2em] transition-all",
              "bg-[#0a192f] text-brand-primary border-2 border-brand-primary",
              !canPlay ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
            )}
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}
          >
            <div className="absolute inset-1 border-2 border-dashed border-brand-primary pointer-events-none" />
            <span className="relative font-light">PLAY GAMES</span>
          </motion.button>

          <p className="text-gray-400 font-light uppercase text-sm">or</p>

          <motion.button
            onClick={() => router.push("/leaderboard")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center justify-center w-full h-16 bg-[#0a192f] text-brand-primary border-2 border-brand-primary transition-all"
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}
          >
            <div className="absolute inset-1 border-2 border-dashed border-brand-primary pointer-events-none" />
            <span className="relative font-light uppercase tracking-[0.2em]">VIEW LEADERBOARD</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}