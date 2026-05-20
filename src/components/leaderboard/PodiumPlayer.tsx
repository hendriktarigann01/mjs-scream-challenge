import Image from "next/image";
import { Crown } from "lucide-react";
import type { LeaderboardEntry, AvatarId } from "@/types/game";
import { getAvatarSrc } from "@/components/constants/avatars";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR: AvatarId = "profile-1";

const AVATAR_SIZE = {
  1: "w-24 h-24",
  2: "w-20 h-20",
  3: "w-20 h-20",
} as const;

interface PodiumPlayerProps {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
}

export function PodiumPlayer({ entry, rank }: PodiumPlayerProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-36">
      {rank === 1 && (
        <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400" />
      )}
      {rank !== 1 && <div className="h-10" />}

      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0 border-4 border-white/80 shadow-md",
          AVATAR_SIZE[rank],
        )}
      >
        <Image
          src={getAvatarSrc((entry.avatar as AvatarId) ?? DEFAULT_AVATAR)}
          alt={entry.player_name}
          fill
          className="object-cover"
        />
      </div>

      <span className="text-white font-black text-2xl leading-none">
        {rank}
      </span>

      <span className="text-white font-black text-lg tracking-wide text-center leading-tight truncate w-full">
        {entry.player_name}
      </span>

      <span className="text-white font-bold text-lg tabular-nums">
        {entry.score}
      </span>
    </div>
  );
}
