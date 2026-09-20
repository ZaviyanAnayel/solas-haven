"use client";

import React, { useState, useEffect } from "react";
import { Flame, Sparkles, X, Award, Feather } from "lucide-react";
import { SoulProfile } from "../lib/useSoulProfile";

interface SacredStreakBannerProps {
  profile: SoulProfile;
  onOpenRelease: () => void;
  onOpenProfile: () => void;
}

const DISMISS_STORAGE_KEY = "solas_streak_banner_dismissed_v2";

export default function SacredStreakBanner({
  profile,
  onOpenRelease,
  onOpenProfile,
}: SacredStreakBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const dismissedDate = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedDate !== today) {
        setIsDismissed(false);
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, new Date().toDateString());
    } catch {}
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Daily Presence Reminder"
      className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-30 animate-fade-in pointer-events-auto"
    >
      <div className="relative rounded-2xl border border-amber-400/25 bg-black/90 backdrop-blur-2xl p-1.5 sm:p-3.5 shadow-2xl shadow-black/90 flex items-center justify-between gap-2 text-white max-w-[calc(100vw-6rem)] sm:max-w-md">
        {/* Left: Flame & Streak */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
          title="View Your Soul Profile & Streak Milestones"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex-shrink-0 flex items-center justify-center group-hover:border-amber-400/60 transition-colors">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-amber-300 font-semibold whitespace-nowrap">
              <span>Day {profile.streak} Presence</span>
            </div>
            <p className="hidden sm:block text-[11px] text-white/60 truncate font-light">
              Your beacon is burning. Add a letter today.
            </p>
          </div>
        </button>

        {/* Right: Quick CTA & Dismiss */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onOpenRelease}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 text-neutral-950 font-semibold text-[11px] transition-all shadow-sm cursor-pointer"
          >
            <Feather className="w-3 h-3" />
            <span>Write</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="hidden sm:flex p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="View Milestones & Certificate"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 sm:p-1.5 rounded-full text-white/30 hover:text-white transition-colors cursor-pointer"
            title="Dismiss for today"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
