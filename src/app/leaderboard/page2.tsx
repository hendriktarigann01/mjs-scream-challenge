"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useLayoutVariant } from "@/hooks/useLayoutVariant";
import { PodiumPlayer } from "@/components/leaderboard/PodiumPlayer";
import { RankRow } from "@/components/leaderboard/RankRow";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LeaderboardEntry } from "@/types/game";
import { cn } from "@/lib/utils";

// ── Leaderboard content ───────────────────────────────────────

interface LeaderboardContentProps {
  entries: LeaderboardEntry[];
  layout: "default" | "signage";
}

function LeaderboardContent({ entries, layout }: LeaderboardContentProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-brand-primary font-light uppercase tracking-widest opacity-60">
        No scores yet. Be the first!
      </div>
    );
  }

  const [first, second, third, ...rest] = entries;

  const podium = (
    <div className="flex items-end justify-center">
      {third && <PodiumPlayer entry={third} rank={3} />}
      {first && <PodiumPlayer entry={first} rank={1} />}
      {second && <PodiumPlayer entry={second} rank={2} />}
    </div>
  );

  const rankList = rest.length > 0 && (
    <div className="space-y-2">
      {rest.map((entry, i) => (
        <RankRow key={entry.id} entry={entry} rank={i + 4} />
      ))}
    </div>
  );

  if (layout === "signage") {
    return (
      <div className="flex items-stretch gap-16">
        <div className="flex-1 flex flex-col justify-end">{podium}</div>
        <div className="flex-1 flex flex-col justify-center gap-2 pt-4">
          {rankList}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {podium}
      {rankList}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const router = useRouter();
  const variant = useLayoutVariant();
  const { leaderboard, loading, refetch } = useLeaderboard();

  const handlePlayAgain = () => router.push("/");

  const pageWrapper = (children: React.ReactNode) => (
    <div className="min-h-screen bg-brand-primary-dark flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 h-full w-full 
                  bg-[linear-gradient(to_right,#002965_1px,transparent_1px),linear-gradient(to_bottom,#002965_1px,transparent_1px)] 
                  bg-[size:45px_45px]"
      />
      <Header />
      {children}
      <Footer />
    </div>
  );

  // ── Desktop layout ─────────────────────────────────────────

  if (variant === "desktop") {
    return pageWrapper(
      <main className="flex-1 flex flex-col justify-center items-center px-16 py-6 gap-8 relative z-10">
        {/* Title */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-brand-primary opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-light text-brand-primary tracking-widest uppercase">
            Leaderboard
          </h1>
          <button
            onClick={refetch}
            className="p-2 text-brand-primary opacity-70 hover:opacity-100 transition-opacity"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-16 text-brand-primary font-light uppercase tracking-widest">
                Loading leaderboard…
              </div>
            ) : (
              <LeaderboardContent entries={leaderboard} layout="signage" />
            )}
          </motion.div>
        </div>
      </main>,
    );
  }

  // ── Mobile / Default layout ────────────────────────────────

  return pageWrapper(
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-6 max-w-lg mx-auto w-full relative z-10">
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
          <LeaderboardContent entries={leaderboard} layout="default" />
        )}
      </motion.div>

      {/* Play Again button — matching HomePage style */}
      <motion.button
        onClick={handlePlayAgain}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center justify-center px-14 py-4 font-mono text-xl uppercase tracking-[0.2em]
                   bg-[#0a192f] text-brand-primary border-2 border-brand-primary transition-all cursor-pointer"
      >
        <div className="absolute inset-1 border-2 border-dashed border-brand-primary pointer-events-none" />
        <span className="relative">Play Again</span>
      </motion.button>
    </main>,
  );
}
