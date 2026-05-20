"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type {
  GameState,
  GameResult,
  GameLevel,
  Player,
  AvatarId,
} from "@/types/game";
import RegisterScreen from "@/components/RegisterScreen";
import InstructionScreen from "@/components/InstructionScreen";
import CountdownScreen from "@/components/CountdownScreen";
import GameplayScreen from "@/components/GameplayScreen";
import { WinModal } from "@/components/WinModal";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function Home() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [result, setResult] = useState<GameResult | null>(null);
  const [level, setLevel] = useState<GameLevel>("normal");
  const [player, setPlayer] = useState<Player | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { addScore } = useLeaderboard();

  const handleConfirmRegister = useCallback((p: Player, l: GameLevel) => {
    setPlayer(p);
    setLevel(l);
    localStorage.setItem("mjs_player_name", p.name);
    localStorage.setItem("mjs_player_avatar", p.avatar);
    setGameState("instruction");
  }, []);

  const handleStartGame = useCallback((selectedLevel: GameLevel) => {
    setLevel(selectedLevel);
    setGameState("countdown");
  }, []);

  const handleCountdownComplete = useCallback(
    () => setGameState("playing"),
    [],
  );

  const handleGameFinish = useCallback((res: GameResult) => {
    setResult(res);
    if (res.isWin) {
      setGameState("result");
    } else {
      setGameState("idle");
      setResult(null);
      setPlayer(null);
    }
  }, []);

  const handleViewLeaderboard = useCallback(async () => {
    if (!result || !player) return;
    setSubmitting(true);
    try {
      await addScore({
        playerName: player.name,
        avatar: player.avatar as AvatarId,
        score: result.score,
        level: result.level,
      });
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
    setSubmitting(false);
    router.push("/leaderboard");
  }, [result, player, addScore, router]);

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col">
      <Header />
      <Image
        src="/common/background.webp"
        alt="Background"
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />
      <div className="relative z-10 w-full flex-1 overflow-hidden">
        {gameState === "idle" && (
          <RegisterScreen onConfirm={handleConfirmRegister} />
        )}
        {gameState === "instruction" && (
          <InstructionScreen onStartGame={handleStartGame} />
        )}
        {gameState === "countdown" && (
          <CountdownScreen onComplete={handleCountdownComplete} />
        )}
        {gameState === "playing" && (
          <GameplayScreen level={level} onFinish={handleGameFinish} />
        )}

        {gameState === "result" && result && result.isWin && (
          <WinModal
            finalScore={result.score}
            maxCombo={result.comboMultiplier}
            onLeaderboard={handleViewLeaderboard}
            submitting={submitting}
          />
        )}
      </div>
      <Footer className="relative z-20" />
    </main>
  );
}
