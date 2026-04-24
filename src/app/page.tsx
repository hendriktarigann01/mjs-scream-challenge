"use client";

import { useState, useCallback, useRef } from "react";
import type { GamePhase, GameResult, Player, GameLevel } from "@/types/game";
import RegisterScreen from "@/components/RegisterScreen";
import InstructionScreen from "@/components/InstructionScreen";
import CountdownScreen from "@/components/CountdownScreen";
import GameplayScreen from "@/components/GameplayScreen";
import ResultScreen from "@/components/ResultScreen";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("register");
  const [player, setPlayer] = useState<Player>({ name: "", avatar: "profile-1" });
  const [level, setLevel] = useState<GameLevel>("normal");
  const [result, setResult] = useState<GameResult | null>(null);
  const [calibratedThreshold, setCalibratedThreshold] = useState<number | null>(null);

  const handleRegister = useCallback((p: Player, l: GameLevel) => {
    setPlayer(p);
    setLevel(l);
    setPhase("instruction");
  }, []);

  const handleStartGame = useCallback(() => setPhase("countdown"), []);
  const handleCountdownComplete = useCallback((threshold: number) => {
    setCalibratedThreshold(threshold);
    setPhase("playing");
  }, []);

  const handleGameFinish = useCallback((res: GameResult) => {
    setResult(res);
    setPhase("result");
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setPhase("register"); // reset ke register, bukan idle
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Header />
      <div className="relative w-full h-full">
        {phase === "register" && <RegisterScreen onConfirm={handleRegister} />}
        {phase === "instruction" && (
          <InstructionScreen onStartGame={handleStartGame} />
        )}
        {phase === "countdown" && (
          <CountdownScreen onComplete={handleCountdownComplete} />
        )}
        {phase === "playing" && (
          <GameplayScreen
            player={player}
            level={level}
            calibratedThreshold={calibratedThreshold}
            onFinish={handleGameFinish}
          />
        )}
        {phase === "result" && result && (
          <ResultScreen result={result} onReset={handleReset} />
        )}
      </div>
      <Footer />
    </main>
  );
}
