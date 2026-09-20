"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Sparkles,
  Award,
  Flame,
  Star,
  Compass,
  Moon,
  Feather,
  Flower2,
  Check,
  MapPin,
  FileText,
  Shield,
  Heart,
  Navigation,
  LocateFixed,
  Loader2
} from "lucide-react";
import {
  SoulProfile,
  CELESTIAL_AVATARS,
  SACRED_MILESTONES,
  CelestialAvatar,
} from "../lib/useSoulProfile";
import BlessingCertificateModal from "./BlessingCertificateModal";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SoulProfile;
  onSaveProfile: (updates: Partial<SoulProfile>) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: UserProfileModalProps) {
  const [name, setName] = useState(profile.name || "Zaviyan");
  const [location, setLocation] = useState(profile.location || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId || "solas-star");
  const [customAvatarUrl, setCustomAvatarUrl] = useState(profile.customAvatarUrl || "");
  const [activeTab, setActiveTab] = useState<"identity" | "avatars" | "milestones">("identity");
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect visitor's real-time city & country
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const res = await fetch("/api/geo");
      if (res.ok) {
        const data = await res.json();
        if (data && data.city && data.country && data.country !== "Earth") {
          const detected = `${data.city}, ${data.country}`;
          setLocation(detected);
          setIsDetectingLocation(false);
          return detected;
        }
      }
    } catch {}

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts = tz.split("/");
      const city = parts[parts.length - 1]?.replace(/_/g, " ");
      if (city) {
        setLocation(city);
        setIsDetectingLocation(false);
        return city;
      }
    } catch {}

    setIsDetectingLocation(false);
  };

  // Sync inputs with profile whenever modal is opened
  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name || "Zaviyan");
      setBio(profile.bio || "");
      setSelectedAvatarId(profile.avatarId || "solas-star");
      setCustomAvatarUrl(profile.customAvatarUrl || "");
      setLocation(profile.location || "");
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile({
      name: name.trim() || "Seeker of Light",
      location: location.trim(),
      bio: bio.trim(),
      avatarId: selectedAvatarId,
      customAvatarUrl: customAvatarUrl.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  const currentAvatar =
    CELESTIAL_AVATARS.find((a) => a.id === selectedAvatarId) || CELESTIAL_AVATARS[0];

  return (
    <>
      <div className="fixed inset-0 z-[70] pointer-events-auto flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-xl bg-[#09090e] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/90 my-auto max-h-[90dvh] overflow-y-auto scrollbar-none pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Profile Header with Avatar Preview */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            {/* Avatar Circle */}
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-tr ${currentAvatar.gradient} p-0.5 shadow-lg flex-shrink-0 relative overflow-hidden`}
              style={{ boxShadow: `0 0 20px ${currentAvatar.auraColor}40` }}
            >
              {customAvatarUrl ? (
                <img
                  src={customAvatarUrl}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#09090e] flex items-center justify-center text-amber-300">
                  <Sparkles className="w-7 h-7" />
                </div>
              )}
            </div>

            {/* Name & Streak Tag */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-semibold text-white">
                  {name || "Seeker of Light"}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono flex items-center gap-1 font-semibold">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Day {profile.streak}</span>
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                {location ? `Residence: ${location}` : "Soul in the Living Sky"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 text-xs font-mono overflow-x-auto scrollbar-none">
            {[
              { id: "identity", label: "Soul Identity" },
              { id: "avatars", label: "Celestial Avatars" },
              { id: "milestones", label: `Presence & Milestones (${profile.streak}d)` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full transition-all border ${
                  activeTab === tab.id
                    ? "bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-md shadow-amber-400/10"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Identity & Bio */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/60 mb-1.5">
                  Soul Name / Pen Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zaviyan, Ayla, Anonymous Soul"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50"
                  maxLength={40}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-white/60">
                    Home City / Region <span className="text-white/40 text-[10px] font-sans font-normal">(Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300 hover:text-amber-200 transition-all disabled:opacity-50 group"
                    title="Auto-detect current location"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    ) : (
                      <Navigation className="w-3 h-3 text-amber-400 transition-transform group-hover:scale-110" />
                    )}
                    <span className="underline underline-offset-2">
                      {isDetectingLocation ? "Detecting..." : "Auto-Detect"}
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Leave blank or enter city (Optional)"
                    className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50"
                    maxLength={50}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {location && (
                      <button
                        type="button"
                        onClick={() => setLocation("")}
                        className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        title="Clear location"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:border-amber-400/40 border border-white/10 text-[10px] font-mono text-amber-300 transition-all flex items-center gap-1"
                      title="Detect with GPS / Network IP"
                    >
                      <LocateFixed className={`w-3 h-3 ${isDetectingLocation ? "animate-spin" : ""}`} />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/60 mb-1.5">
                  Soul Intention / Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What brings you to the sanctuary? Write a quiet whisper..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50 resize-none"
                  maxLength={180}
                />
              </div>

              {/* Stats Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-3 gap-2 text-center mt-4">
                <div>
                  <div className="text-lg font-serif text-amber-300 font-semibold">
                    {profile.starsReleased}
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">Stars Released</div>
                </div>
                <div>
                  <div className="text-lg font-serif text-amber-300 font-semibold">
                    {profile.vigilsJoined}
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">Vigils Held</div>
                </div>
                <div>
                  <div className="text-lg font-serif text-amber-300 font-semibold">
                    {profile.streak} Days
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">Sacred Streak</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Celestial Avatars */}
          {activeTab === "avatars" && (
            <div className="space-y-4">
              <p className="text-xs text-white/50 leading-relaxed">
                Choose a sacred emblem that reflects the nature of your prayers, or paste a custom image URL:
              </p>

              {/* Avatar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {CELESTIAL_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatarId === avatar.id && !customAvatarUrl;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => {
                        setSelectedAvatarId(avatar.id);
                        setCustomAvatarUrl("");
                      }}
                      className={`relative p-3 rounded-2xl border transition-all flex flex-col items-center text-center group ${
                        isSelected
                          ? "bg-amber-400/15 border-amber-400 shadow-md shadow-amber-400/20"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-tr ${avatar.gradient} p-0.5 mb-2 shadow-sm`}
                      >
                        <div className="w-full h-full rounded-full bg-[#09090e] flex items-center justify-center text-amber-300">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-white/90 line-clamp-1">
                        {avatar.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL Option */}
              <div className="pt-3 border-t border-white/10">
                <label className="block text-xs font-mono text-white/60 mb-1.5">
                  Or Paste Custom Avatar Photo URL:
                </label>
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Daily Presence & Milestones */}
          {activeTab === "milestones" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-semibold">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>DAYS OF SOLACE • PRESENCE JOURNEY</span>
                  </div>
                  <h3 className="text-xl font-serif text-white font-semibold mt-0.5">
                    Day {profile.streak} of Continuous Presence
                  </h3>
                  <p className="text-xs text-white/50">
                    Longest recorded presence: {profile.longestStreak} days
                  </p>
                </div>

                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 text-black text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Testament of Solace</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {SACRED_MILESTONES.map((m) => {
                  const isAchieved = profile.streak >= m.day;
                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isAchieved
                          ? "bg-amber-400/[0.07] border-amber-400/30 text-white"
                          : "bg-white/[0.02] border-white/5 text-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold ${
                            isAchieved
                              ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                              : "bg-white/10 text-white/40"
                          }`}
                        >
                          {m.badge}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-serif font-semibold text-white/90">
                              {m.titleEnglish}
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50">{m.description}</div>
                          <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                            ★ Honor: {m.reward}
                          </div>
                        </div>
                      </div>

                      {isAchieved ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/30 flex-shrink-0">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-white/30 flex-shrink-0">
                          Day {m.day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 text-black font-semibold text-xs transition-all shadow-md shadow-amber-300/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Soul Profile</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Blessing Certificate Modal */}
      <BlessingCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
      />
    </>
  );
}
