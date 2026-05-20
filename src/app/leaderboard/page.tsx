"use client";
export const dynamic = "force-dynamic";

import { useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { PodiumPlayer } from "@/components/leaderboard/PodiumPlayer";
import { RankRow } from "@/components/leaderboard/RankRow";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardEntry } from "@/types/game";
import Image from "next/image";
import { cn } from "@/lib/utils";


interface LeaderboardContentProps {
  entries: LeaderboardEntry[];
}

const LeaderboardContent = memo(function LeaderboardContent({
  entries,
}: LeaderboardContentProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-white font-light uppercase tracking-widest opacity-60">
        No scores yet. Be the first!
      </div>
    );
  }

  const [first, second, third, ...rest] = entries;

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-end justify-center gap-4">
        {first && <PodiumPlayer entry={first} rank={1} />}
        {second && <PodiumPlayer entry={second} rank={2} />}
        {third && <PodiumPlayer entry={third} rank={3} />}
      </div>

      {rest.length > 0 && (
        <div className="flex flex-col gap-5">
          {rest.map((entry, i) => (
            <RankRow key={entry.id} entry={entry} rank={i + 4} />
          ))}
        </div>
      )}
    </div>
  );
});

LeaderboardContent.displayName = "LeaderboardContent";

export default function LeaderboardPage() {
  const router = useRouter();
  const { leaderboard, loading } = useLeaderboard();

  const handlePlayAgain = useCallback(() => router.push("/"), [router]);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden items-center justify-between">
      <Image
        src="/common/background.webp"
        alt="background"
        fill
        className="object-cover z-0"
        priority
      />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center z-10 w-full px-8 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center w-full max-w-lg gap-8 mx-auto">
          <h1 className="text-white text-5xl font-black uppercase tracking-widest text-center drop-shadow-sm">
            Leaderboard
          </h1>

        
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white font-light uppercase tracking-widest">
                Loading leaderboard…
              </div>
            ) : (
              <LeaderboardContent entries={leaderboard} />
            )}
          </motion.div>
          <motion.button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "w-full h-14 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all",
              "bg-transparent border-[2px] border-white shadow-[0_4px_0_0_#FFFFFF] text-white",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#FFFFFF]",
            )}
          >
            <span className="relative">Play Again</span>
          </motion.button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
