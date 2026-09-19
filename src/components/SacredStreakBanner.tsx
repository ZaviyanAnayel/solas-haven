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
      className="fixed bottom-6 left-4 sm:left-6 z-30 animate-fade-in pointer-events-auto max-w-sm sm:max-w-md"
    >
      <div className="relative rounded-2xl border border-amber-400/25 bg-black/85 backdrop-blur-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/90 flex items-center justify-between gap-3 text-white">
        {/* Left: Flame & Streak */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex-shrink-0 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-semibold">
              <span>Day {profile.streak} of Presence</span>
            </div>
            <p className="text-[11px] text-white/60 truncate font-light">
              Your beacon is burning. Add a letter today.
            </p>
          </div>
        </div>

        {/* Right: Quick CTA & Dismiss */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenRelease}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 text-neutral-950 font-semibold text-[11px] transition-all shadow-sm"
          >
            <Feather className="w-3 h-3" />
            <span>Write</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="View Milestones & Certificate"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-full text-white/30 hover:text-white transition-colors"
            title="Dismiss for today"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
