"use client";

import { useState, useCallback, useRef } from "react";
import type { GameState, GameResult } from "@/types/game";
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
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = useCallback(() => setGameState("instruction"), []);
  const handleStartGame = useCallback(() => setGameState("countdown"), []);
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
    <main className="relative w-full h-screen overflow-hidden">
      <Header />
      <video
        ref={videoRef}
        src="/background-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      {videoReady && (
        <div className="relative z-10 w-full h-full">
          {gameState === "idle" && <IdleScreen onStart={handleStart} />}
          {gameState === "instruction" && (
            <InstructionScreen onStartGame={handleStartGame} />
          )}
          {gameState === "countdown" && (
            <CountdownScreen onComplete={handleCountdownComplete} />
          )}
          {gameState === "playing" && (
            <GameplayScreen onFinish={handleGameFinish} />
          )}
          {gameState === "result" && result && (
            <ResultScreen result={result} onReset={handleReset} />
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}
