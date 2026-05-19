"use client";
export const dynamic = "force-dynamic";

import { useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { PodiumPlayer } from "@/components/leaderboard/PodiumPlayer";
import { RankRow } from "@/components/leaderboard/RankRow";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardEntry } from "@/types/game";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ── Leaderboard content ───────────────────────────────────────

interface LeaderboardContentProps {
  entries: LeaderboardEntry[];
}

const LeaderboardContent = memo(function LeaderboardContent({
  entries,
}: LeaderboardContentProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-brand-primary font-light uppercase tracking-widest opacity-60">
        No scores yet. Be the first!
      </div>
    );
  }

  const [first, second, third, ...rest] = entries;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Podium */}
      <div className="flex items-end justify-center">
        {third && <PodiumPlayer entry={third} rank={3} />}
        {first && <PodiumPlayer entry={first} rank={1} />}
        {second && <PodiumPlayer entry={second} rank={2} />}
      </div>

      {/* Rank list */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-3">
          {rest.map((entry, i) => (
            <RankRow key={entry.id} entry={entry} rank={i + 4} />
          ))}
        </div>
      )}
    </div>
  );
});

LeaderboardContent.displayName = "LeaderboardContent";

// ── Page ──────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const router = useRouter();
  const { leaderboard, loading, refetch } = useLeaderboard();

  const handlePlayAgain = useCallback(() => router.push("/"), [router]);

  return (
    <>
      <Image
        src="/common/background.webp"
        alt="background"
        fill
        className="object-cover z-0"
        priority
      />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6 py-6">
        <div className="flex flex-col items-center w-full max-w-lg gap-6">

          {/* Title row */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-brand-primary opacity-70 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-light text-brand-primary tracking-widest uppercase">
              Leaderboard
            </h1>
            <button
              onClick={refetch}
              className="p-2 text-brand-primary opacity-70 hover:opacity-100 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center py-16 text-brand-primary font-light uppercase tracking-widest">
                Loading leaderboard…
              </div>
            ) : (
              <LeaderboardContent entries={leaderboard} />
            )}
          </motion.div>

          {/* Play Again button */}
          <motion.button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "w-full h-14 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all",
              "bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] text-brand-primary",
              "active:translate-y-[2px] active:shadow-[0_2px_0_0_#191B34]",
            )}  >
            <span className="relative">Play Again</span>
          </motion.button>
        </div>
      </main>

      <Footer />
    </>
  );
}