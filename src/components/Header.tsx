"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES, LetterCategory } from "../lib/types";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Feather,
  Star,
  ShieldCheck,
  BookOpen,
  Compass,
  Search,
  X,
  Globe2,
  MapPin,
  ChevronDown,
  Wind,
  Flame,
  Moon
} from "lucide-react";
import { filterRegions, EarthRegion } from "../lib/countries";
import { useSoulProfile, CELESTIAL_AVATARS } from "../lib/useSoulProfile";
import GlobalPulse from "./GlobalPulse";

interface HeaderProps {
  selectedCategory: LetterCategory | "all";
  onSelectCategory: (cat: LetterCategory | "all") => void;
  searchLocation: string;
  onSearchLocationChange: (val: string) => void;
  onOpenReleaseModal: () => void;
  onOpenPrivacyModal: () => void;
  onWander: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  totalStarsCount: number;
  userStarsCount: number;
  onFocusMyStar: () => void;
  onOpenVigil?: () => void;
  onOpenBreath?: () => void;
  onOpenProfile?: () => void;
  onOpenWell?: () => void;
}

export default function Header({
  selectedCategory,
  onSelectCategory,
  searchLocation,
  onSearchLocationChange,
  onOpenReleaseModal,
  onOpenPrivacyModal,
  onWander,
  isAudioPlaying,
  onToggleAudio,
  totalStarsCount,
  userStarsCount,
  onFocusMyStar,
  onOpenVigil,
  onOpenBreath,
  onOpenProfile,
  onOpenWell,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localCountry, setLocalCountry] = useState<string>("");
  const { profile } = useSoulProfile();
  const currentAvatar =
    CELESTIAL_AVATARS.find((a) => a.id === profile.avatarId) || CELESTIAL_AVATARS[0];
  const matchingRegions = filterRegions(searchLocation, 12);

  // Dynamically detect the visitor's own country or region so it's customized for EVERY user worldwide
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts = tz.split("/");
      const region = parts[parts.length - 1]?.replace(/_/g, " ");
      if (region) {
        setLocalCountry(region);
      }
    } catch {}

    // Lightweight async IP check for exact country name
    fetch("https://ipapi.co/json/", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.country_name) {
          setLocalCountry(data.country_name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 sm:py-4 flex flex-col gap-2.5">
        {/* Top Bar: Brand, Counter, Tools */}
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Logo & Vision */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400/15 via-amber-500/5 to-purple-500/10 border border-amber-300/30 backdrop-blur-xl shadow-xl shadow-amber-500/15 group">
              <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-700 group-hover:scale-110">
                <defs>
                  <linearGradient id="solasGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="havenArc" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.7" />
                  </linearGradient>
                  <radialGradient id="solasGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Haven Sanctuary Arc / Cradle */}
                <path
                  d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22"
                  stroke="url(#havenArc)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 1"
                  className="opacity-75"
                />
                <path
                  d="M10 21C10 26.5228 14.4772 31 20 31C25.5228 31 30 26.5228 30 21"
                  stroke="url(#solasGold)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Central Solas Radiant Star (Light) */}
                <circle cx="20" cy="18" r="4" fill="url(#solasGlow)" className="animate-pulse" />
                <path
                  d="M20 7L21.6 14.4L29 16L21.6 17.6L20 25L18.4 17.6L11 16L18.4 14.4Z"
                  fill="url(#solasGold)"
                />
                <circle cx="20" cy="16" r="1.5" fill="#FFFFFF" />
              </svg>
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md pointer-events-none" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-[0.14em] uppercase text-white/95 text-[14px] sm:text-[16px] font-serif">
                  Solas Haven
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-[11px] text-white/50 font-light">
                <span className="hidden sm:inline">Where unspoken words find peace</span>
                <span className="hidden sm:inline text-white/20">•</span>
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  className="inline-flex items-center gap-1 text-emerald-400/90 hover:text-emerald-300 transition-colors font-mono cursor-pointer"
                  title="View Sanctuary Zero-Knowledge Guarantee"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Anonymous</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Navigation Capsule (Clean Apple / Vercel style) */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-lg shadow-black/40 shrink-0">
            <Link
              href="/chronicles"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Chronicles</span>
            </Link>

            {onOpenVigil && (
              <button
                type="button"
                onClick={onOpenVigil}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-200/90 hover:text-amber-200 hover:bg-amber-400/15 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                title="Hold Global Silent Vigil"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Vigil</span>
              </button>
            )}

            {onOpenBreath && (
              <button
                type="button"
                onClick={onOpenBreath}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-sky-200/90 hover:text-sky-200 hover:bg-sky-400/15 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                title="Somatic Grounding Breath"
              >
                <Wind className="w-3.5 h-3.5 text-sky-300" />
                <span>Breathe</span>
              </button>
            )}

            {onOpenWell && (
              <button
                type="button"
                onClick={onOpenWell}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-200/90 hover:text-amber-200 hover:bg-amber-400/15 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                title="Talk with Solas (Sanctuary AI)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Let&apos;s Talk</span>
              </button>
            )}

            <button
              type="button"
              onClick={onWander}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-200/90 hover:text-indigo-200 hover:bg-indigo-400/15 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title="Wander to a random star"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-300" />
              <span>Wander</span>
            </button>

            <Link
              href="/about"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap shrink-0"
            >
              About
            </Link>
          </nav>

          {/* Right Action Tools Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Earth Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full border text-xs transition-all backdrop-blur-xl cursor-pointer ${
                isSearchOpen || searchLocation
                  ? "bg-amber-400/20 border-amber-400/50 text-amber-200 shadow-md shadow-amber-400/20"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white"
              }`}
              title={searchLocation ? `Filtered by ${searchLocation}` : "Filter stars by region"}
            >
              <Globe2 className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleAudio}
              title={isAudioPlaying ? "Mute ambient audio" : "Play 432Hz ambient frequency"}
              className={`p-2 rounded-full border transition-all duration-300 backdrop-blur-xl ${
                isAudioPlaying
                  ? "bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-md shadow-amber-500/20"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* User Stars Locator */}
            {userStarsCount > 0 && (
              <button
                onClick={onFocusMyStar}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 transition-all text-xs font-medium"
                title="Locate your stars"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="hidden sm:inline">{userStarsCount}</span>
              </button>
            )}

            {/* Soul Profile Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-400/40 text-white transition-all text-xs font-medium shadow-sm"
              title="Your Profile & Starlight Milestones"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-tr ${currentAvatar.gradient} p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden`}
              >
                {profile.customAvatarUrl ? (
                  <img
                    src={profile.customAvatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Sparkles className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="hidden sm:inline font-serif">{profile.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono flex items-center gap-0.5 font-semibold">
                <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>{profile.streak}d</span>
              </span>
            </button>

            {/* Primary Action: Release a Star */}
            <button
              onClick={onOpenReleaseModal}
              className="group relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-300/20 hover:shadow-amber-300/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Feather className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
              <span>Release</span>
            </button>
          </div>
        </div>

        {/* Expandable Earth Region Search Bar (Dynamic & Universal with Live Autocomplete) */}
        {isSearchOpen && (
          <div className="relative pointer-events-auto flex flex-col gap-2 p-2.5 rounded-2xl bg-black/85 border border-white/15 backdrop-blur-2xl animate-fade-in shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchLocation}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    onSearchLocationChange(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  placeholder="Search any country or realm (e.g. United States, Japan, Brazil, Ocean)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 transition-all"
                />
                {searchLocation && (
                  <button
                    onClick={() => {
                      onSearchLocationChange("");
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-2.5 p-1 rounded-full text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dynamic Universal Presets - Shows User's OWN local place first! */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
                <button
                  onClick={() => {
                    onSearchLocationChange("");
                    setIsDropdownOpen(false);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    !searchLocation
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  All Earth
                </button>

                {/* Dynamic Local Region Button */}
                {localCountry && (
                  <button
                    onClick={() => {
                      onSearchLocationChange(localCountry);
                      setIsDropdownOpen(false);
                    }}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                      searchLocation.toLowerCase() === localCountry.toLowerCase()
                        ? "bg-amber-400/25 border-amber-400/60 text-amber-300"
                        : "bg-amber-400/10 border-amber-400/25 text-amber-300/80 hover:text-amber-200"
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Near Me ({localCountry})</span>
                  </button>
                )}

                {/* Universal Poetic Earth Realms */}
                {[
                  { label: "🌊 Oceans", query: "Ocean" },
                  { label: "🌲 Forests", query: "Rainforest" },
                  { label: "🏔️ Mountains", query: "Himalayas" },
                  { label: "❄️ Polar", query: "Antarctica" }
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => {
                      onSearchLocationChange(r.query);
                      setIsDropdownOpen(false);
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                      searchLocation.toLowerCase() === r.query.toLowerCase()
                        ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE AUTOCOMPLETE DROPDOWN - Displays all matching world nations and realms */}
            {isDropdownOpen && searchLocation.trim().length > 0 && matchingRegions.length > 0 && (
              <div className="w-full mt-1 p-2 rounded-xl bg-neutral-900/95 border border-white/15 shadow-2xl max-h-56 overflow-y-auto scrollbar-none animate-fade-in z-50">
                <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-mono text-white/40 border-b border-white/10 mb-1">
                  <span>WORLD NATIONS & REALMS MATCHING "{searchLocation.toUpperCase()}" ({matchingRegions.length})</span>
                  <span className="text-amber-300/80">Tap to Filter & Teleport</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {matchingRegions.map((region) => (
                    <button
                      key={region.name}
                      type="button"
                      onClick={() => {
                        onSearchLocationChange(region.name);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-neutral-200 hover:text-white hover:bg-white/10 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm shrink-0">{region.flag}</span>
                        <span className="truncate">{region.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 ml-2 shrink-0">
                        {region.category === "realm" ? "Realm" : region.category === "city" ? "City" : "Nation"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Pills (Sub-Nav) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 backdrop-blur-md border ${
                  isSelected
                    ? "bg-white/15 border-white/40 text-white shadow-md shadow-white/10"
                    : "bg-black/40 border-white/10 text-white/50 hover:text-white/90 hover:bg-white/[0.08]"
                }`}
                style={
                  isSelected && cat.id !== "all"
                    ? {
                        borderColor: `${cat.color}70`,
                        backgroundColor: `${cat.color}20`,
                        color: "#ffffff"
                      }
                    : {}
                }
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Pulse Ticker (Flows naturally right below category pills with ZERO collision) */}
        <GlobalPulse />
      </div>
    </header>
  );
}