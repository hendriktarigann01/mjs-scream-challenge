import Image from "next/image";
import type { LeaderboardEntry, AvatarId } from "@/types/game";
import { getAvatarSrc } from "@/components/constants/avatars";

const DEFAULT_AVATAR: AvatarId = "profile-1";

interface RankRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function RankRow({ entry, rank }: RankRowProps) {
  return (
    <div className="flex items-center gap-4 w-full py-2">
      <span className="text-white font-black text-2xl w-8 text-center flex-shrink-0 tabular-nums">
        {rank}
      </span>

      <div
        className="relative flex-1 flex items-center border border-white rounded-full bg-brand-primary shadow-sm"
        style={{ height: "64px", paddingLeft: "84px", paddingRight: "24px" }}
      >
        <div
          className="absolute rounded-full overflow-hidden border-[3px] border-white z-10"
          style={{
            left: "-12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "80px",
            height: "80px",
          }}
        >
          <Image
            src={getAvatarSrc((entry.avatar as AvatarId) ?? DEFAULT_AVATAR)}
            alt={entry.player_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <span className="text-white font-bold text-xl tracking-wide truncate">
            {entry.player_name}
          </span>

          <span className="text-white font-bold text-xl tabular-nums flex-shrink-0">
            {entry.score}
          </span>
        </div>
      </div>
    </div>
  );
}
