"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { GameState, GameResult, GameLevel } from "@/types/game";
import IdleScreen from "@/components/IdleScreen";
import InstructionScreen from "@/components/InstructionScreen";
import CountdownScreen from "@/components/CountdownScreen";
import GameplayScreen from "@/components/GameplayScreen";
import ResultScreen from "@/components/ResultScreen";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [result, setResult] = useState<GameResult | null>(null);
  const [level, setLevel] = useState<GameLevel>("normal");

  const handleStart = useCallback(() => setGameState("instruction"), []);

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
    setGameState("result");
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setGameState("idle");
  }, []);

  return (
    <main className="relative w-full h-screen overflow-auto flex flex-col">
      <Header />
      <Image
        src="/common/background.webp"
        alt="Background"
        width={1000}
        height={600}
        priority
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="relative z-10 w-full h-full">
        {gameState === "idle" && <IdleScreen onStart={handleStart} />}
        {gameState === "instruction" && (
          <InstructionScreen onStartGame={handleStartGame} />
        )}
        {gameState === "countdown" && (
          <CountdownScreen onComplete={handleCountdownComplete} />
        )}
        {gameState === "playing" && (
          <GameplayScreen level={level} onFinish={handleGameFinish} />
        )}
        {gameState === "result" && result && (
          <ResultScreen result={result} onReset={handleReset} />
        )}
      </div>
      <Footer className="relative z-20" />
    </main>
  );
}
