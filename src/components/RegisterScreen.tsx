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
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-8">
            <div className="z-10 flex flex-col items-center gap-10 max-w-xl w-full">
                {/* Title */}
                <div className="flex flex-col items-center gap-2">
                    <h1
                        className="text-brand-primary font-black leading-none text-center tracking-wider uppercase"
                        style={{ fontSize: "clamp(2.8rem, 7vw, 4.5rem)" }}
                    >
                        HOW LOUD IS YOUR VOICE?
                    </h1>
                    <p
                        className="text-brand-primary/70 tracking-widest uppercase text-center font-black"
                        style={{ fontSize: "1rem" }}
                    >
                        SHOW US YOUR LOUDEST VOICE!
                    </p>
                </div>

                {/* Name input */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <label
                        className="text-brand-primary uppercase tracking-[0.2em] font-black"
                        style={{ fontSize: "1rem" }}
                    >
                        ENTER YOUR NAME
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                        placeholder="Your Name Here"
                        className={cn(
                            "w-full h-16 px-6 text-center font-bold bg-white text-brand-primary rounded-full",
                            "border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34]",
                            "uppercase tracking-[0.15em] placeholder:text-brand-primary/30 focus:outline-none",
                        )}
                        style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            canPlay &&
                            onConfirm({ name: name.trim(), avatar }, "normal")
                        }
                    />
                </div>

                {/* Avatar grid */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <label
                        className="text-brand-primary uppercase tracking-widest font-black"
                        style={{ fontSize: "1rem" }}
                    >
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
                                    "relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all duration-200",
                                    avatar === id
                                        ? "border-brand-primary ring-2 ring-brand-primary/40 shadow-lg"
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

                {/* Buttons */}
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <motion.button
                        onClick={() =>
                            canPlay &&
                            onConfirm({ name: name.trim(), avatar }, "normal")
                        }
                        disabled={!canPlay}
                        whileHover={canPlay ? { scale: 1.02 } : {}}
                        whileTap={canPlay ? { scale: 0.97 } : {}}
                        className={cn(
                            "w-full h-14 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all",
                            "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
                            "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
                            !canPlay && "opacity-40 cursor-not-allowed",
                        )}
                    >
                        PLAY GAME
                    </motion.button>

                    <p className="text-brand-primary/60 font-black uppercase text-sm tracking-widest">
                        or
                    </p>

                    <motion.button
                        onClick={() => router.push("/leaderboard")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                            "w-full h-14 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all",
                            "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
                            "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
                        )}
                    >
                        VIEW LEADERBOARD
                    </motion.button>
                </div>
            </div>
        </div>
    );
}