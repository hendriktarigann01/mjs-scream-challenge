import Image from "next/image";
import type { LeaderboardEntry, AvatarId } from "@/types/game";
import { getAvatarSrc } from "@/components/constants/avatars";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR: AvatarId = "profile-1";

type RankTrend = "up" | "down" | "neutral";

const TREND_BY_RANK: Record<number, RankTrend> = {
  4: "down",
  5: "up",
  6: "neutral",
  7: "neutral",
  8: "down",
};

const TREND_ICON = { up: "▲", down: "▼", neutral: "--" } as const;
const TREND_COLOR = {
  up: "text-[#4ADE80]",
  down: "text-[#F87171]",
  neutral: "text-[#4B5563]",
} as const;

interface RankRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function RankRow({ entry, rank }: RankRowProps) {
  const trend = TREND_BY_RANK[rank] ?? "neutral";

  return (
    <div className="flex items-center gap-4 bg-brand-primary-light rounded-full h-[64px] !px-4 py-3 w-full">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={getAvatarSrc((entry.avatar as AvatarId) ?? DEFAULT_AVATAR)}
          alt={entry.player_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Name + time */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm uppercase tracking-wide truncate">
          {entry.player_name}
        </p>
        <p className="text-xs text-white font-medium font-mono">
          {entry.score} PTS
        </p>
      </div>

      {/* Rank badge */}
      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-black text-white text-sm flex-shrink-0">
        {rank}
      </div>

      {/* Trend */}
      <span
        className={cn("text-xs font-bold w-4 text-center", TREND_COLOR[trend])}
      >
        {TREND_ICON[trend]}
      </span>
    </div>
  );
}