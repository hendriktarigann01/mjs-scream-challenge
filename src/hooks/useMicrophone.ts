"use client";

import { useRef, useState, useCallback } from "react";

interface MicrophoneState {
  db: number;
  isActive: boolean;
  error: string | null;
}

interface UseMicrophoneReturn extends MicrophoneState {
  start: () => Promise<void>;
  stop: () => void;
}

const DB_FLOOR = -100;

export function useMicrophone(): UseMicrophoneReturn {
  const [state, setState] = useState<MicrophoneState>({
    db: DB_FLOOR,
    isActive: false,
    error: null,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const freqArrayRef = useRef<Float32Array | null>(null);
  const activeRef = useRef(false);

  const tick = useCallback(() => {
    if (!activeRef.current) return;

    const analyser = analyserRef.current;
    const freqArray = freqArrayRef.current;

    if (analyser && freqArray) {
      analyser.getFloatFrequencyData(freqArray);

      let peak = DB_FLOOR;
      for (let i = 0; i < freqArray.length; i++) {
        if (freqArray[i] > peak) peak = freqArray[i];
      }

      const clamped = Math.max(DB_FLOOR, peak);
      setState((prev) => ({ ...prev, db: clamped }));
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, []); // no deps — reads only refs

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.1;
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      freqArrayRef.current = new Float32Array(analyser.frequencyBinCount);
      activeRef.current = true;

      setState({ db: DB_FLOOR, isActive: true, error: null });
      animFrameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Microphone access denied";
      setState({ db: DB_FLOOR, isActive: false, error: message });
    }
  }, [tick]);

  const stop = useCallback(() => {
    activeRef.current = false;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    analyserRef.current = null;
    freqArrayRef.current = null;

    setState({ db: DB_FLOOR, isActive: false, error: null });
  }, []);

  return { ...state, start, stop };
}
