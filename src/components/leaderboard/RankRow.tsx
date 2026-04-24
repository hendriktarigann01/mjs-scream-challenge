import Image from "next/image";
import type { LeaderboardEntry, AvatarId } from "@/types/game";
import { getAvatarSrc } from "@/components/constants/avatars";
import { formatDuration } from "@/lib/scoreUtils";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR: AvatarId = "profile-1";

interface RankRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function RankRow({ entry, rank }: RankRowProps) {
  return (
    <div className="flex items-center gap-3 bg-brand-primary-dark border border-brand-primary rounded-2xl px-4 py-3">
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={getAvatarSrc((entry.avatar as AvatarId) ?? DEFAULT_AVATAR)}
          alt={entry.player_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Nama + durasi */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-primary text-sm uppercase tracking-wide truncate">
          {entry.player_name}
        </p>
        {/* duration_ms adalah field yang benar sesuai skema Supabase */}
        <p className="text-xs text-brand-primary font-medium font-mono">
          {formatDuration(entry.duration_ms)}
        </p>
      </div>

      {/* Rank badge */}
      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-black text-[#25569E] text-sm flex-shrink-0">
        {rank}
      </div>
    </div>
  );
}
