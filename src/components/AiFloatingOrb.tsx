"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Moon } from "lucide-react";
import { soundEngine } from "../lib/audio";

interface AiFloatingOrbProps {
  onOpenAi: () => void;
}

export default function AiFloatingOrb({ onOpenAi }: AiFloatingOrbProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    soundEngine.playLightShimmer();
    onOpenAi();
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 pointer-events-auto flex items-center group">
      {/* Interactive Floating AI Capsule */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center gap-3 p-1 sm:p-1.5 sm:pr-5 rounded-full bg-gradient-to-r from-neutral-950/90 via-indigo-950/80 to-neutral-950/90 border border-amber-400/30 hover:border-amber-300/60 shadow-2xl shadow-amber-500/20 hover:shadow-amber-400/35 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        title="Let's Talk with Solas (Sanctuary AI Companion)"
      >
        {/* Breathing Starlight Ambient Glow Behind Orb */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/25 via-indigo-500/20 to-purple-500/25 blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition-opacity pointer-events-none" />

        {/* Circular Celestial Star Orb with Continuous Orbital Motion Effect */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          {/* Outer Orbiting Nebula Ring (Continuous Motion Effect) */}
          <div className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-300 via-purple-400 to-indigo-300 animate-[spin_8s_linear_infinite]">
            <div className="w-full h-full rounded-full bg-black/90" />
          </div>

          {/* Secondary Counter-rotating Aura Ring */}
          <div className="absolute inset-1 rounded-full border border-amber-400/20 animate-[spin_12s_linear_infinite_reverse]" />

          {/* Core Living Star (8-Point Celestial Star with Pulsing Motion) */}
          <div className="relative z-10 flex items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 group-hover:scale-110"
            >
              <defs>
                <radialGradient id="aiOrbCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="45%" stopColor="#FDE68A" />
                  <stop offset="80%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </radialGradient>
                <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Deep Pulsing Halo */}
              <circle
                cx="20"
                cy="20"
                r="7"
                fill="#FDE68A"
                opacity="0.3"
                className="animate-ping"
              />

              {/* 8-Point Golden Celestial Star Core */}
              <path
                d="M20 3 L23.5 16.5 L37 20 L23.5 23.5 L20 37 L16.5 23.5 L3 20 L16.5 16.5 Z"
                fill="url(#aiOrbCore)"
                filter="url(#starGlow)"
              />

              {/* Center Diamond Spark */}
              <circle cx="20" cy="20" r="2.2" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Orbiting Tiny Starlight Particle */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#FDE68A] animate-[spin_4s_linear_infinite]" style={{ transformOrigin: "24px 24px" }} />
        </div>

        {/* Mobile-Only Status Dot */}
        <span className="sm:hidden absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* Desktop Text & Label: "✦ Let's Talk" */}
        <div className="hidden sm:flex flex-col text-left pr-1 select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-semibold font-serif tracking-wide text-white group-hover:text-amber-200 transition-colors">
              ✦ Let&apos;s Talk
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80 group-hover:text-amber-200/90 transition-colors">
            Solas Companion • Confidential
          </span>
        </div>
      </button>
    </div>
  );
}
