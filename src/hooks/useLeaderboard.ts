import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { LeaderboardEntry, AvatarId } from "@/types/game";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("leaderboard")
        .select("*")
        .order("duration_ms", { ascending: false }) // skor terbaik = durasi terpanjang
        .limit(10);
      if (fetchError) throw fetchError;
      setLeaderboard(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const addScore = useCallback(async (params: {
    playerName: string;
    avatar: AvatarId;
    durationMs: number;
    level: string;
  }): Promise<boolean> => {
    const payload = {
      player_name: params.playerName,
      avatar: params.avatar,
      duration_ms: Math.round(params.durationMs),
      level: params.level,
    };

    try {
      const { error: insertError } = await supabase
        .from("leaderboard")
        .insert(payload);

      if (insertError) {
        // Log detail untuk debug — termasuk kode error Supabase (misal: 42501 = RLS, 23502 = NOT NULL)
        console.error("[useLeaderboard] Insert error:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
          payload,
        });
        throw insertError;
      }

      await fetchLeaderboard();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add score");
      return false;
    }
  }, [fetchLeaderboard]);

  const isTopScore = (durationMs: number): boolean => {
    if (leaderboard.length < 10) return true;
    return durationMs > leaderboard[leaderboard.length - 1].duration_ms;
  };

  return {
    leaderboard,
    loading,
    error,
    addScore,
    isTopScore,
    refetch: fetchLeaderboard,
  };
}
