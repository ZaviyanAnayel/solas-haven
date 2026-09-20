"use client";

import React, { useState, useEffect } from "react";
import { Radio, ShieldAlert, X, ChevronRight } from "lucide-react";
import {
  GuardianIncident,
  getGuardianIncidents,
  getUnreadIncidentCount,
} from "../lib/guardianEngine";
import CreatorIntelModal from "./CreatorIntelModal";

const CREATOR_STORAGE_KEY = "solas_creator_mode_authorized_v2";

export default function CreatorIntelPulse() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [incidents, setIncidents] = useState<GuardianIncident[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasDismissedToast, setHasDismissedToast] = useState(false);

  // Authenticate Creator Zaviyan only
  useEffect(() => {
    let auth = false;
    try {
      if (localStorage.getItem(CREATOR_STORAGE_KEY) === "true") {
        auth = true;
      }
    } catch {}

    // Check secret URL param: ?operator=zaviyan or ?creator=zaviyan or ?admin=solas777
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const op = urlParams.get("operator") || urlParams.get("creator") || urlParams.get("admin");
        if (op === "zaviyan" || op === "solas777" || urlParams.has("zaviyan")) {
          auth = true;
          try {
            localStorage.setItem(CREATOR_STORAGE_KEY, "true");
          } catch {}
          // Clean URL without reload
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch {}
    }

    setIsAuthorized(auth);

    // Secret Keybind: Ctrl + Shift + Z to unlock / toggle
    const handleKeybind = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "Z" || e.key === "z")) {
        e.preventDefault();
        const input = prompt("Sanctuary Security — Enter Creator Key:");
        if (input === "zaviyan" || input === "solas777") {
          try {
            localStorage.setItem(CREATOR_STORAGE_KEY, "true");
          } catch {}
          setIsAuthorized(true);
          alert("Sentinel Intel Unlocked. Welcome, Creator Zaviyan.");
        } else if (input !== null) {
          alert("Access Denied.");
        }
      }
    };

    window.addEventListener("keydown", handleKeybind);
    return () => window.removeEventListener("keydown", handleKeybind);
  }, []);

  const handleLockCreatorMode = () => {
    try {
      localStorage.removeItem(CREATOR_STORAGE_KEY);
    } catch {}
    setIsAuthorized(false);
    setIsModalOpen(false);
    setShowToast(false);
  };

  const refreshData = () => {
    if (!isAuthorized) return;
    const list = getGuardianIncidents();
    setIncidents(list);
    const unread = getUnreadIncidentCount();
    setUnreadCount(unread);
    if (unread > 0 && !hasDismissedToast) {
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    refreshData();

    // Listen for custom events dispatched by guardianEngine
    const handleLogged = () => {
      refreshData();
      setShowToast(true);
      setHasDismissedToast(false);
    };
    const handleRead = () => {
      refreshData();
      setShowToast(false);
    };

    window.addEventListener("solas-guardian-incident-logged", handleLogged);
    window.addEventListener("solas-guardian-incidents-read", handleRead);

    return () => {
      window.removeEventListener("solas-guardian-incident-logged", handleLogged);
      window.removeEventListener("solas-guardian-incidents-read", handleRead);
    };
  }, [hasDismissedToast, isAuthorized]);

  // NEVER render anything if not authorized!
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      {/* Toast Notification Alert for Operator Zaviyan */}
      {showToast && unreadCount > 0 && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 rounded-2xl bg-[#0b0c14]/95 border border-amber-400/40 shadow-xl shadow-amber-500/10 backdrop-blur-xl text-white flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/95">
                  <span>Sanctuary Sentinel Alert</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono">
                    {unreadCount} new
                  </span>
                </div>
                <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
                  Flagged incident logged in sanctuary feed.
                </p>
                <button
                  onClick={() => {
                    setShowToast(false);
                    setIsModalOpen(true);
                  }}
                  className="mt-2 text-[11px] text-amber-300 font-mono font-medium hover:underline flex items-center gap-1"
                >
                  <span>Review Operator Intel</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowToast(false);
                setHasDismissedToast(true);
              }}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Radar Pill in Bottom Left (Next to or above daily presence) */}
      <div className="fixed bottom-20 left-6 z-30 hidden sm:block">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08090f]/80 backdrop-blur-md border border-white/10 hover:border-amber-400/40 text-xs text-white/70 hover:text-white transition-all shadow-lg hover:shadow-amber-500/10"
          title="Sanctuary Sentinel • Creator Intelligence"
        >
          <Radio className="w-3 h-3 text-amber-300 group-hover:animate-pulse" />
          <span className="font-mono text-[11px]">Sentinel Intel</span>
          {unreadCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-mono font-bold animate-pulse">
              {unreadCount}
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Creator Intel Modal */}
      <CreatorIntelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incidents={incidents}
        onRefresh={refreshData}
        onLockCreatorMode={handleLockCreatorMode}
      />
    </>
  );
}
