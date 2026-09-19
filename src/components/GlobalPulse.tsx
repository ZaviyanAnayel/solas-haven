"use client";

import React, { useState, useEffect } from "react";

const LIVE_EVENTS = [
  { text: "A soul in Chicago just sent light to a star in Kyoto", icon: "🤍" },
  { text: "A quiet prayer was released from Kyoto, Japan", icon: "🕯️" },
  { text: "A whisper of comfort traveled from London to Sophia in Florence", icon: "✨" },
  { text: "A sailor in the Pacific Ocean released an unspoken goodbye", icon: "🌊" },
  { text: "Someone in Istanbul found solace in a star from Toronto", icon: "🍃" },
  { text: "A daughter in Melbourne left a prayer for Room 402 in Kyoto", icon: "🕊️" },
  { text: "A silent prayer was born in the Amazon Rainforest, Brazil", icon: "🌴" },
  { text: "A stranger in Berlin sent light to a soul in Cairo", icon: "🤍" },
  { text: "4,820 silent prayers and memories united across 62 countries tonight", icon: "🌍" }
];

export default function GlobalPulse() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
        setIsVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentEvent = LIVE_EVENTS[currentIndex];

  return (
    <div className="pointer-events-none flex justify-center w-full px-2">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl shadow-lg transition-all duration-500 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[9px] font-mono tracking-widest text-amber-300/90 uppercase hidden sm:inline">
            GLOBAL PULSE:
          </span>
        </div>

        <span className="text-xs shrink-0">{currentEvent.icon}</span>

        <p className="text-[10px] sm:text-[11px] text-white/80 font-sans tracking-wide truncate max-w-[260px] sm:max-w-md">
          {currentEvent.text}
        </p>
      </div>
    </div>
  );
}