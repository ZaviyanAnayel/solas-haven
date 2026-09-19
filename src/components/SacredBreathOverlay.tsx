"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wind, X, Heart, Sparkles, Volume2, VolumeX } from "lucide-react";
import { soundEngine } from "../lib/audio";

interface SacredBreathOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onBreathScale: (scale: number) => void;
}

type BreathPhase = "inhale" | "hold" | "exhale";

export default function SacredBreathOverlay({
  isOpen,
  onClose,
  onBreathScale,
}: SacredBreathOverlayProps) {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [cycleCount, setCycleCount] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Phase durations
  const PHASE_TIMES: Record<BreathPhase, number> = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  useEffect(() => {
    if (!isOpen) {
      setPhase("inhale");
      setCycleCount(1);
      setSecondsRemaining(4);
      onBreathScale(1.0);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    // Play initial sound
    if (soundEnabled) soundEngine.playBreathTone("inhale");

    let currentPhase: BreathPhase = "inhale";
    let timeLeft = 4;
    let cycle = 1;

    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = "hold";
          timeLeft = 7;
          if (soundEnabled) soundEngine.playBreathTone("hold");
        } else if (currentPhase === "hold") {
          currentPhase = "exhale";
          timeLeft = 8;
          if (soundEnabled) soundEngine.playBreathTone("exhale");
        } else {
          currentPhase = "inhale";
          timeLeft = 4;
          cycle += 1;
          setCycleCount(cycle);
          if (soundEnabled) soundEngine.playBreathTone("inhale");
        }
        setPhase(currentPhase);
      }
      setSecondsRemaining(timeLeft);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      onBreathScale(1.0);
    };
  }, [isOpen, soundEnabled, onBreathScale]);

  // Smooth canvas breath scale modulation
  useEffect(() => {
    if (!isOpen) return;

    let startTime = performance.now();
    const animateBreath = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      let scale = 1.0;

      if (phase === "inhale") {
        const progress = Math.min((4 - secondsRemaining + (elapsed % 1)) / 4, 1);
        scale = 1.0 + progress * 0.12; // smoothly expands by 12%
      } else if (phase === "hold") {
        scale = 1.12;
      } else {
        const progress = Math.min((8 - secondsRemaining + (elapsed % 1)) / 8, 1);
        scale = 1.12 - progress * 0.12; // smoothly contracts back
      }

      onBreathScale(scale);
      animFrameRef.current = requestAnimationFrame(animateBreath);
    };

    animFrameRef.current = requestAnimationFrame(animateBreath);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, phase, secondsRemaining, onBreathScale]);

  if (!isOpen) return null;

  const phaseInstruction =
    phase === "inhale"
      ? "Inhale Peace into Your Chest"
      : phase === "hold"
      ? "Hold the Stillness Within"
      : "Exhale the Heavy Weight";

  const phaseColor =
    phase === "inhale"
      ? "text-sky-300 border-sky-400/40 shadow-sky-500/20"
      : phase === "hold"
      ? "text-amber-300 border-amber-400/40 shadow-amber-500/20"
      : "text-emerald-300 border-emerald-400/40 shadow-emerald-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-neutral-950/90 p-6 sm:p-8 text-white text-center shadow-2xl shadow-black overflow-hidden">
        {/* Ambient background aura */}
        <div
          className={`pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl transition-all duration-1000 ${
            phase === "inhale"
              ? "bg-sky-500/20"
              : phase === "hold"
              ? "bg-amber-500/20"
              : "bg-emerald-500/20"
          }`}
        />

        {/* Top Tools */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
            title={soundEnabled ? "Mute breath tones" : "Enable breath tones"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-mono uppercase tracking-widest mb-4">
          <Wind className="w-3 h-3 text-sky-300" />
          <span>Sacred 4-7-8 Somatic Grounding</span>
        </div>

        {/* Breathing Circle Visualization */}
        <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
          {/* Animated pulsing outer halo */}
          <div
            className={`absolute inset-0 rounded-full border transition-all duration-1000 ${
              phase === "inhale"
                ? "scale-110 border-sky-400/30 bg-sky-400/5"
                : phase === "hold"
                ? "scale-105 border-amber-400/40 bg-amber-400/10"
                : "scale-90 border-emerald-400/30 bg-emerald-400/5"
            }`}
          />

          {/* Central Counter */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-mono font-light tracking-tight text-white/95">
              {secondsRemaining}s
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 mt-1">
              {phase.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Phase Instruction */}
        <h3 className="text-lg font-serif font-semibold text-white/95 mb-1 tracking-wide">
          {phaseInstruction}
        </h3>
        <p className="text-xs text-white/40 font-mono">
          Cycle {cycleCount} • Parasympathetic Grounding
        </p>

        {/* Exit Button */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-medium text-xs transition-all"
          >
            Return to Starlight
          </button>
        </div>
      </div>
    </div>
  );
}
