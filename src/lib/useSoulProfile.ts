"use client";

import { useState, useEffect, useCallback } from "react";

export interface SoulProfile {
  name: string;
  avatarId: string;
  customAvatarUrl?: string;
  location: string;
  bio: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
  starsReleased: number;
  vigilsJoined: number;
  breathsCompleted: number;
  unlockedMilestones: string[];
}

export interface CelestialAvatar {
  id: string;
  name: string;
  title: string;
  iconSvg: string;
  gradient: string;
  auraColor: string;
}

export const CELESTIAL_AVATARS: CelestialAvatar[] = [
  {
    id: "solas-star",
    name: "The Golden Solas",
    title: "Emblem of Divine Light",
    gradient: "from-amber-400 via-amber-200 to-amber-500",
    auraColor: "#fbbf24",
    iconSvg: "star",
  },
  {
    id: "crescent-haven",
    name: "The Crescent Cradle",
    title: "Sanctuary of Gentle Rest",
    gradient: "from-indigo-400 via-sky-200 to-indigo-600",
    auraColor: "#818cf8",
    iconSvg: "moon",
  },
  {
    id: "sacred-lotus",
    name: "The Mystic Lotus",
    title: "Purity Rising from Sorrow",
    gradient: "from-rose-400 via-pink-200 to-rose-600",
    auraColor: "#f43f5e",
    iconSvg: "flower",
  },
  {
    id: "polaris-beacon",
    name: "The Polaris Compass",
    title: "Guide Through the Deepest Night",
    gradient: "from-cyan-400 via-teal-200 to-emerald-500",
    auraColor: "#22d3ee",
    iconSvg: "compass",
  },
  {
    id: "eternal-flame",
    name: "The Sacred Flame",
    title: "Unextinguished Devotion",
    gradient: "from-orange-500 via-amber-300 to-red-500",
    auraColor: "#f97316",
    iconSvg: "flame",
  },
  {
    id: "celestial-dove",
    name: "The Dove of Solace",
    title: "Messenger of Eternal Peace",
    gradient: "from-emerald-400 via-teal-200 to-teal-500",
    auraColor: "#34d399",
    iconSvg: "dove",
  },
  {
    id: "cosmic-nebula",
    name: "The Spiral Nebula",
    title: "Mystery of Infinite Creation",
    gradient: "from-purple-500 via-violet-300 to-fuchsia-600",
    auraColor: "#a855f7",
    iconSvg: "sparkles",
  },
  {
    id: "golden-quill",
    name: "The Eternal Quill",
    title: "Chronicler of Truth",
    gradient: "from-yellow-400 via-amber-100 to-yellow-600",
    auraColor: "#eab308",
    iconSvg: "feather",
  },
];

export const SACRED_MILESTONES = [
  {
    id: "first_spark",
    day: 1,
    badge: "Day 1",
    titleEnglish: "The First Beacon",
    description: "Your first star is released into the cosmos. The journey of solace begins.",
    reward: "Starlight Inauguration",
  },
  {
    id: "harmonic_resonance",
    day: 3,
    badge: "Day 3",
    titleEnglish: "Harmonic Resonance",
    description: "Three consecutive days of presence. Your star resonates with sister constellations.",
    reward: "Silver Star Halo",
  },
  {
    id: "constellation_sentinel",
    day: 7,
    badge: "Day 7",
    titleEnglish: "Constellation Sentinel",
    description: "One complete week of unbroken presence. An extraordinary milestone of inner peace.",
    reward: "Testament of Solace (Digital Honor Certificate)",
  },
  {
    id: "eternal_starlight",
    day: 14,
    badge: "Day 14",
    titleEnglish: "Eternal Radiance",
    description: "Two weeks of continuous anchoring. Your presence radiates an amber corona across the sky.",
    reward: "Golden Corona Star Aura",
  },
  {
    id: "sanctuary_sovereign",
    day: 40,
    badge: "Day 40",
    titleEnglish: "Sanctuary Sovereign",
    description: "Forty days of continuous presence. Ordained as a permanent Pillar of Solas Haven.",
    reward: "Sovereign Sigil & Cosmic Node Anchor",
  },
];

const PROFILE_STORAGE_KEY = "solas_haven_soul_profile_v1";

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getYesterdayDateString(): string {
  const yesterday = new Date(Date.now() - 86400000);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
}

const DEFAULT_PROFILE: SoulProfile = {
  name: "Zaviyan",
  avatarId: "solas-star",
  location: "",
  bio: "Walking in quiet reverence. Releasing unspoken words into the constellations.",
  streak: 1,
  lastActiveDate: getTodayDateString(),
  longestStreak: 1,
  starsReleased: 3,
  vigilsJoined: 1,
  breathsCompleted: 2,
  unlockedMilestones: ["first_spark"],
};

export function useSoulProfile() {
  const [profile, setProfile] = useState<SoulProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile from localStorage and update daily streak
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      if (saved) {
        const parsed: SoulProfile = JSON.parse(saved);
        if (parsed.location === "Lahore, Pakistan") {
          parsed.location = "";
        }
        let updatedStreak = parsed.streak || 1;

        if (parsed.lastActiveDate === yesterday) {
          // Continuous day! Increment streak
          updatedStreak += 1;
        } else if (parsed.lastActiveDate === today) {
          // Already visited today, keep current streak
          updatedStreak = parsed.streak || 1;
        } else {
          // Missed a day, reset streak to 1
          updatedStreak = 1;
        }

        const longest = Math.max(parsed.longestStreak || 1, updatedStreak);

        // Check milestones
        const newMilestones = [...(parsed.unlockedMilestones || ["first_spark"])];
        SACRED_MILESTONES.forEach((m) => {
          if (updatedStreak >= m.day && !newMilestones.includes(m.id)) {
            newMilestones.push(m.id);
          }
        });

        const newProfile: SoulProfile = {
          ...parsed,
          streak: updatedStreak,
          longestStreak: longest,
          lastActiveDate: today,
          unlockedMilestones: newMilestones,
        };

        setProfile(newProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      } else {
        // First visit
        setProfile(DEFAULT_PROFILE);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }
    } catch {
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<SoulProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const recordStarRelease = useCallback(() => {
    setProfile((prev) => {
      const updated = { ...prev, starsReleased: (prev.starsReleased || 0) + 1 };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const recordVigil = useCallback(() => {
    setProfile((prev) => {
      const updated = { ...prev, vigilsJoined: (prev.vigilsJoined || 0) + 1 };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const recordBreath = useCallback(() => {
    setProfile((prev) => {
      const updated = { ...prev, breathsCompleted: (prev.breathsCompleted || 0) + 1 };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return {
    profile,
    isLoaded,
    updateProfile,
    recordStarRelease,
    recordVigil,
    recordBreath,
  };
}
