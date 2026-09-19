"use client";

import React, { useEffect } from "react";
import { ShieldAlert, AlertTriangle, Lock, HeartHandshake, X } from "lucide-react";

interface SanctuaryGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  strikeLevel: number; // 1, 2, or 3
  guidanceMessage?: string | null;
  reason?: string | null;
  remainingMs?: number;
}

export default function SanctuaryGuardianModal({
  isOpen,
  onClose,
  strikeLevel,
  guidanceMessage,
  reason,
  remainingMs,
}: SanctuaryGuardianModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && strikeLevel < 3) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, strikeLevel]);

  if (!isOpen) return null;

  const hoursLeft = remainingMs
    ? Math.max(1, Math.ceil(remainingMs / (1000 * 60 * 60)))
    : 24;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 text-white selection:bg-amber-400/30 selection:text-amber-100"
      onClick={(e) => {
        if (e.target === e.currentTarget && strikeLevel < 3) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border ${
          strikeLevel === 1
            ? "bg-[#0b0c13] border-amber-400/40 shadow-amber-500/10"
            : strikeLevel === 2
            ? "bg-[#0f090b] border-red-500/50 shadow-red-500/15"
            : "bg-[#120709] border-red-600/70 shadow-red-600/20"
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            {strikeLevel === 1 ? (
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <HeartHandshake className="w-4 h-4" />
              </div>
            ) : strikeLevel === 2 ? (
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-600/25 border border-red-600/50 flex items-center justify-center text-red-400">
                <Lock className="w-4 h-4" />
              </div>
            )}
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  strikeLevel === 1
                    ? "bg-amber-400/10 text-amber-300 border-amber-400/25"
                    : strikeLevel === 2
                    ? "bg-red-500/10 text-red-300 border-red-500/30"
                    : "bg-red-600/20 text-red-200 border-red-600/40"
                }`}
              >
                {strikeLevel === 1
                  ? "Sanctuary Guidance • Notice 1"
                  : strikeLevel === 2
                  ? "Formal Warning • Notice 2"
                  : "Sanctuary Rest • Strike 3"}
              </span>
            </div>
          </div>

          {strikeLevel < 3 && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-white mb-2 leading-snug">
          {strikeLevel === 1 && "A Gentle Note from the Sanctuary Guardian"}
          {strikeLevel === 2 && "Preserving Sacred Reverence in Solas Haven"}
          {strikeLevel === 3 && "Voice Temporarily Suspended"}
        </h3>

        {/* Subtitle / Context */}
        <p className="text-xs text-white/60 mb-5 leading-relaxed">
          {strikeLevel === 1 &&
            "Your draft was set aside because it contained words that can inflict emotional pain or hostility on another human soul."}
          {strikeLevel === 2 &&
            "This is your second reminder. Solas Haven is a refuge for healing, grief, and quiet reflection — not hostility, harassment, or targeted malice."}
          {strikeLevel === 3 &&
            `To protect all souls seeking solace, your voice has been placed on pause for ${hoursLeft} hours.`}
        </p>

        {/* AI Guidance Box */}
        <div
          className={`p-4 rounded-2xl border mb-6 text-xs sm:text-sm leading-relaxed ${
            strikeLevel === 1
              ? "bg-amber-400/[0.04] border-amber-400/20 text-amber-100/90"
              : strikeLevel === 2
              ? "bg-red-500/[0.05] border-red-500/25 text-red-100/90"
              : "bg-red-600/[0.08] border-red-600/30 text-red-200/90"
          }`}
        >
          <div className="font-serif italic text-white/90 mb-2">
            "{guidanceMessage ||
              "Every person visiting this sanctuary carries silent grief or memories of someone they lost. Please speak with gentleness, or keep your thoughts in silent contemplation."}"
          </div>
          {reason && (
            <div className="text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
              Guardian Evaluation: {reason}
            </div>
          )}
        </div>

        {/* Escalation Explainer */}
        <div className="py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 font-mono flex items-center justify-between mb-6">
          <span>Current Standing:</span>
          <span
            className={
              strikeLevel === 1
                ? "text-amber-300"
                : strikeLevel === 2
                ? "text-red-400"
                : "text-red-500 font-bold"
            }
          >
            {strikeLevel === 1 && "1 of 3 Strikes (Gentle Warning)"}
            {strikeLevel === 2 && "2 of 3 Strikes (Final Warning)"}
            {strikeLevel === 3 && `Locked for ~${hoursLeft}h`}
          </span>
        </div>

        {/* Action Button */}
        <div>
          {strikeLevel < 3 ? (
            <button
              onClick={onClose}
              className={`w-full py-3 px-5 rounded-full text-xs font-semibold transition-all shadow-lg ${
                strikeLevel === 1
                  ? "bg-gradient-to-r from-amber-300 to-amber-400 text-black hover:brightness-110 shadow-amber-300/20"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 shadow-red-500/25"
              }`}
            >
              {strikeLevel === 1
                ? "I Understand & Will Speak with Gentleness"
                : "Acknowledge Warning & Re-examine My Words"}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors border border-white/10"
            >
              Close & Reflect in Silence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
