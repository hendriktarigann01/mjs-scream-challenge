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
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12 py-10">
      <div className="z-10 flex flex-col items-center gap-14  w-full">
        <div className="flex flex-col items-center gap-4">
          <h1
            className="text-brand-primary-light max-w-[720px] font-black leading-none text-center tracking-wider uppercase"
            style={{ fontSize: "clamp(4rem, 6.5vw, 6.5rem)" }}
          >
            HOW LOUD IS YOUR VOICE?
          </h1>
          <p
            className="text-brand-primary-light text-center font-black"
            style={{ fontSize: "1.5rem" }}
          >
            Turn your voice into light. Show your energy.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <label
            className="text-brand-primary-light uppercase tracking-[0.2em] font-black"
            style={{ fontSize: "1.35rem" }}
          >
            ENTER YOUR NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="INPUT YOUR NAME"
            className={cn(
              "w-full max-w-xl text-2xl h-24 px-8 text-center font-black bg-brand-primary text-brand-primary-light rounded-full",
              "border-[4px] border-white shadow-[0_6px_0_0_#FFFFFF]",
              "uppercase tracking-[0.15em] placeholder:text-brand-primary-light/30 focus:outline-none",
            )}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              canPlay &&
              onConfirm({ name: name.trim(), avatar }, "normal")
            }
          />
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <label
            className="text-brand-primary-light uppercase tracking-widest font-black"
            style={{ fontSize: "1.35rem" }}
          >
            SELECT YOUR AVATAR
          </label>
          <div className="grid grid-cols-3 gap-8">
            {AVATAR_IDS.map((id) => (
              <motion.button
                key={id}
                onClick={() => setAvatar(id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  "relative w-32 h-32 rounded-full overflow-hidden border-5 transition-all duration-200",
                  avatar === id
                    ? "border-white ring-4 ring-brand-primary/40 shadow-xl"
                    : "border-white/60 opacity-60 hover:opacity-90",
                )}
              >
                <Image
                  src={getAvatarSrc(id)}
                  alt={id}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

         <div className="flex flex-col items-center gap-5 w-full max-w-xl">
          <motion.button
            onClick={() =>
              canPlay && onConfirm({ name: name.trim(), avatar }, "normal")
            }
            disabled={!canPlay}
            whileHover={canPlay ? { scale: 1.02 } : {}}
            whileTap={canPlay ? { scale: 0.97 } : {}}
            className={cn(
              "w-full h-20 rounded-full uppercase tracking-[0.2em] font-black text-2xl transition-all",
              "bg-transparent border-[4px] border-white shadow-[0_6px_0_0_#FFFFFF] text-brand-primary-light",
              "active:translate-y-[3px] active:shadow-[0_3px_0_0_#FFFFFF]",
              !canPlay && "opacity-40 cursor-not-allowed",
            )}
          >
            START THE CHALLENGE
          </motion.button>

          <p className="text-brand-primary-light/60 font-black uppercase text-lg tracking-widest">
            or
          </p>

          <motion.button
            onClick={() => router.push("/leaderboard")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "w-full h-20 rounded-full uppercase tracking-[0.2em] font-black text-2xl transition-all",
              "bg-transparent border-[4px] border-white shadow-[0_6px_0_0_#FFFFFF] text-brand-primary-light",
              "active:translate-y-[3px] active:shadow-[0_3px_0_0_#FFFFFF]",
            )}
          >
            VIEW LEADERBOARD
          </motion.button>
        </div>
      </div>
    </div>
  );
}
