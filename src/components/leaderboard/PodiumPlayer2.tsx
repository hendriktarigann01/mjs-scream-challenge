import Image from "next/image";
import { Crown } from "lucide-react";
import { LeaderboardEntry, AvatarId } from "@/types/game";
import { getAvatarImageSrc } from "@/constants/gameImages";
import { formatTimeMs } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR: AvatarId = "profile-1";

const PODIUM_HEIGHT = { 1: "h-40", 2: "h-28", 3: "h-20" } as const;
const BORDER_COLOR = {
  1: "border-[#2563EB]",
  2: "border-[#EAB308]",
  3: "border-[#15803D]",
} as const;
const BADGE_BG = {
  1: "bg-[#EFF6FF]",
  2: "bg-[#FEFCE8]",
  3: "bg-[#F0FDF4]",
} as const;
const TEXT_COLOR = {
  1: "text-[#2563EB]",
  2: "text-[#5BA4F5]",
  3: "text-[#5BA4F5]",
} as const;

interface PodiumPlayerProps {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
}

export function PodiumPlayer({ entry, rank }: PodiumPlayerProps) {
  const podiumBg = rank === 1 ? "bg-brand-primary" : "bg-[#25569E]";
  const statsColor = rank === 1 ? "text-white" : TEXT_COLOR[rank];
  const dimension = rank === 1 ? "w-16 h-16" : "w-12 h-12";

  return (
    <div className="flex flex-col items-center gap-1">
      {rank === 1 && (
        <Crown className="w-7 h-7 text-yellow-400 fill-yellow-400 mb-1" />
      )}

      {/* Avatar */}
      <div className="relative mb-2">
        <div
          className={cn(
            "relative rounded-full border-4 overflow-hidden flex items-center justify-center bg-white",
            dimension,
            BORDER_COLOR[rank],
          )}
        >
          <Image
            src={getAvatarImageSrc(
              (entry.avatar as AvatarId) ?? DEFAULT_AVATAR,
            )}
            alt={entry.player_name}
            fill
            className="object-cover"
          />
        </div>

        {/* Rank badge */}
        <div
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 z-20",
            "w-5 h-5 rounded-full flex items-center justify-center",
            "text-[10px] font-black leading-none shadow-sm border border-white/50",
            BADGE_BG[rank],
            TEXT_COLOR[rank],
          )}
        >
          <span className="translate-y-[0.5px]">{rank}</span>
        </div>
      </div>

      {/* Podium bar with stats */}
      <div
        className={cn(
          "w-30 rounded-t-xl shadow-sm transition-all duration-500",
          "flex flex-col items-center justify-start pt-4 px-1 gap-1",
          PODIUM_HEIGHT[rank],
          podiumBg,
        )}
      >
        <span className={cn("font-bold text-xs font-mono", statsColor)}>
          {formatTimeMs(entry.time_ms)}
        </span>
        <span
          className={cn(
            "font-extrabold text-[10px] uppercase tracking-tighter text-center leading-tight",
            statsColor,
          )}
        >
          {entry.player_name}
        </span>
      </div>
    </div>
  );
}
